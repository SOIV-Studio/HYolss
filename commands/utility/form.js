const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pool } = require('../../database.js'); // DB 연결 객체만 가져오기

// 양식 시스템 관련 함수들

module.exports = {
  data: new SlashCommandBuilder()
    .setName('form')
    .setDescription('양식 시스템을 사용합니다.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('submit')
        .setDescription('양식을 작성하여 제출합니다.')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('양식 유형')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('양식 설정을 구성합니다. (관리자 전용)')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('양식 유형 (고유 식별자)')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('name')
            .setDescription('양식 이름 (표시용)')
            .setRequired(true)
        )
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('양식 제출 결과를 전송할 채널')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('서버에 등록된 양식 목록을 조회합니다.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('양식의 필드를 편집합니다. (관리자 전용)')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('양식 유형')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('양식을 삭제합니다. (관리자 전용)')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('양식 유형')
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    // 관리자 권한 확인 (setup, edit, delete 명령어용)
    if (['setup', 'edit', 'delete'].includes(subcommand) && !interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: '이 명령어는 관리자 권한이 필요합니다.',
        ephemeral: true
      });
    }
    
    switch (subcommand) {
      case 'submit':
        const formType = interaction.options.getString('type');
        await handleFormSubmit(interaction, formType);
        break;
      
      case 'setup':
        const newFormType = interaction.options.getString('type');
        const formName = interaction.options.getString('name');
        const channel = interaction.options.getChannel('channel');
        await handleFormSetup(interaction, newFormType, formName, channel.id);
        break;
      
      case 'list':
        await handleFormList(interaction);
        break;
      
      case 'edit':
        const editFormType = interaction.options.getString('type');
        await handleFormEdit(interaction, editFormType);
        break;
      
      case 'delete':
        const deleteFormType = interaction.options.getString('type');
        await handleFormDelete(interaction, deleteFormType);
        break;
    }
  },
  
  // 자동완성 처리
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    
    if (focusedOption.name === 'type') {
      const serverId = interaction.guildId;
      const forms = await getServerForms(serverId);
      
      const choices = forms.map(form => ({
        name: `${form.form_name} (${form.form_type})`,
        value: form.form_type
      }));
      
      const filtered = choices.filter(choice => 
        choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
        choice.value.toLowerCase().includes(focusedOption.value.toLowerCase())
      );
      
      await interaction.respond(
        filtered.slice(0, 25) // Discord는 최대 25개 옵션만 지원
      );
    }
  }
};

// 서버의 모든 양식 조회
async function getServerForms(serverId) {
  const query = `
    SELECT form_type, form_name, designated_channel
    FROM form_configurations
    WHERE server_id = $1
    ORDER BY form_name;
  `;
  try {
    const res = await pool.query(query, [serverId]);
    return res.rows;
  } catch (err) {
    console.error('양식 목록 조회 오류:', err);
    return [];
  }
}

// 양식 구성 조회 함수
async function getFormConfiguration(serverId, formType) {
  const query = `
    SELECT form_name, fields, designated_channel
    FROM form_configurations
    WHERE server_id = $1 AND form_type = $2
    LIMIT 1;
  `;
  const values = [serverId, formType];
  try {
    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error('양식 구성 조회 오류:', err);
    return null;
  }
}

// 양식 구성 저장 함수
async function saveFormConfiguration(serverId, formType, formName, fields, designatedChannel) {
  const query = `
    INSERT INTO form_configurations (server_id, form_type, form_name, fields, designated_channel)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (server_id, form_type) 
    DO UPDATE SET form_name = $3, fields = $4, designated_channel = $5, updated_at = CURRENT_TIMESTAMP;
  `;
  // fields를 JSON 문자열로 명시적으로 변환
  const fieldsJson = JSON.stringify(fields);
  const values = [serverId, formType, formName, fieldsJson, designatedChannel];
  try {
    await pool.query(query, values);
    return true;
  } catch (err) {
    console.error('양식 구성 저장 오류:', err);
    return false;
  }
}

// 양식 삭제 함수
async function deleteFormConfiguration(serverId, formType) {
  const query = `
    DELETE FROM form_configurations
    WHERE server_id = $1 AND form_type = $2;
  `;
  const values = [serverId, formType];
  try {
    const res = await pool.query(query, values);
    return res.rowCount > 0;
  } catch (err) {
    console.error('양식 삭제 오류:', err);
    return false;
  }
}

// 양식 제출 처리 함수
async function handleFormSubmit(interaction, formType) {
  try {
    // 서버 ID 가져오기
    const serverId = interaction.guildId;
    
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 모달 생성
    const modal = new ModalBuilder()
      .setCustomId(`form_${formType}_${interaction.user.id}`)
      .setTitle(formConfig.form_name);
    
    // 입력 필드 추가
    const actionRows = [];
    for (const field of formConfig.fields) {
      const textInput = new TextInputBuilder()
        .setCustomId(field.id)
        .setLabel(field.label)
        .setStyle(field.style === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setPlaceholder(field.placeholder || '')
        .setRequired(field.required || false);
      
      if (field.max_length) textInput.setMaxLength(field.max_length);
      if (field.min_length) textInput.setMinLength(field.min_length);
      
      const actionRow = new ActionRowBuilder().addComponents(textInput);
      actionRows.push(actionRow);
    }
    
    modal.addComponents(...actionRows);
    
    // 모달 표시
    await interaction.showModal(modal);
    
    // 모달 제출 대기
    const filter = (modalInteraction) => 
      modalInteraction.customId === `form_${formType}_${interaction.user.id}`;
    
    try {
      const modalSubmission = await interaction.awaitModalSubmit({
        filter,
        time: 300000 // 5분 제한
      });
      
      // 제출된 데이터 처리
      const submission = {};
      for (const field of formConfig.fields) {
        submission[field.id] = modalSubmission.fields.getTextInputValue(field.id);
      }
      
      // 지정된 채널 ID 가져오기 (없으면 현재 채널 사용)
      const channelId = formConfig.designated_channel || interaction.channelId;
      
      // 채널에 메시지 전송
      const channel = interaction.client.channels.cache.get(channelId);
      if (!channel) {
        return modalSubmission.reply({
          content: '지정된 채널을 찾을 수 없습니다.',
          ephemeral: true
        });
      }
      
      // 임베드 메시지 생성
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${formConfig.form_name} 제출`)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();
      
      // 필드 추가
      for (const field of formConfig.fields) {
        embed.addFields({
          name: field.label,
          value: submission[field.id] || '(입력 없음)'
        });
      }
      
      // 채널에 전송
      await channel.send({ embeds: [embed] });
      
      // 사용자에게 확인 메시지
      await modalSubmission.reply({
        content: '양식이 성공적으로 제출되었습니다.',
        ephemeral: true
      });
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('모달 제출 시간 초과');
      } else {
        console.error('모달 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('양식 제출 처리 오류:', error);
    await interaction.reply({
      content: '양식 처리 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 양식 설정 처리 함수
async function handleFormSetup(interaction, formType, formName, channelId) {
  try {
    // 서버 ID 가져오기
    const serverId = interaction.guildId;
    
    // 기본 필드 설정
    const defaultFields = [
      { 
        id: 'field_1', 
        label: '필드 1', 
        style: 'short', 
        required: true, 
        placeholder: '내용을 입력하세요' 
      }
    ];
    
    // 양식 구성 저장
    const success = await saveFormConfiguration(serverId, formType, formName, defaultFields, channelId);
    
    if (success) {
      // 필드 편집 안내 메시지
      await interaction.reply({
        content: `양식 '${formName}'이(가) 성공적으로 생성되었습니다. 제출된 양식은 <#${channelId}> 채널로 전송됩니다.\n\n이제 \`/form edit type:${formType}\` 명령어를 사용하여 양식 필드를 편집할 수 있습니다.`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '양식 설정 저장 중 오류가 발생했습니다.',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('양식 설정 처리 오류:', error);
    await interaction.reply({
      content: '양식 설정 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 양식 목록 조회 함수
async function handleFormList(interaction) {
  try {
    // 서버 ID 가져오기
    const serverId = interaction.guildId;
    
    // 양식 목록 가져오기
    const forms = await getServerForms(serverId);
    
    if (forms.length === 0) {
      return interaction.reply({
        content: '이 서버에 등록된 양식이 없습니다. `/form setup` 명령어를 사용하여 양식을 생성하세요.',
        ephemeral: true
      });
    }
    
    // 임베드 메시지 생성
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('서버 양식 목록')
      .setDescription('이 서버에 등록된 양식 목록입니다.')
      .setTimestamp();
    
    // 양식 정보 추가
    for (const form of forms) {
      embed.addFields({
        name: form.form_name,
        value: `유형: \`${form.form_type}\`\n채널: <#${form.designated_channel}>\n사용법: \`/form submit type:${form.form_type}\``
      });
    }
    
    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  } catch (error) {
    console.error('양식 목록 조회 오류:', error);
    await interaction.reply({
      content: '양식 목록 조회 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 양식 편집 처리 함수
async function handleFormEdit(interaction, formType) {
  try {
    // 서버 ID 가져오기
    const serverId = interaction.guildId;
    
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드 편집 UI 생성
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`'${formConfig.form_name}' 양식 편집`)
      .setDescription('아래 버튼을 사용하여 양식 필드를 관리하세요.')
      .addFields(
        { name: '현재 필드', value: formConfig.fields.map(f => `• ${f.label} (${f.id})`).join('\n') || '필드 없음' }
      );
    
    // 버튼 생성
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`form_add_field_${formType}`)
          .setLabel('필드 추가')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`form_edit_field_${formType}`)
          .setLabel('필드 편집')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(formConfig.fields.length === 0),
        new ButtonBuilder()
          .setCustomId(`form_remove_field_${formType}`)
          .setLabel('필드 삭제')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(formConfig.fields.length === 0),
        new ButtonBuilder()
          .setCustomId(`form_change_channel_${formType}`)
          .setLabel('채널 변경')
          .setStyle(ButtonStyle.Secondary)
      );
    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
    
    // 버튼 상호작용 대기
    const filter = i => 
      i.customId.startsWith('form_') && 
      i.user.id === interaction.user.id;
    
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 300000 // 5분 제한
    });
    
    collector.on('collect', async i => {
      // 버튼 ID 파싱
      const [action, target, targetFormType] = i.customId.split('_').slice(1);
      
      if (action === 'add' && target === 'field') {
        await handleAddField(i, serverId, targetFormType);
      } else if (action === 'edit' && target === 'field') {
        await handleEditField(i, serverId, targetFormType);
      } else if (action === 'remove' && target === 'field') {
        await handleRemoveField(i, serverId, targetFormType);
      } else if (action === 'change' && target === 'channel') {
        await handleChangeChannel(i, serverId, targetFormType);
      }
    });
    
    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({
          content: '시간이 초과되어 양식 편집이 종료되었습니다.',
          components: [],
          embeds: []
        }).catch(console.error);
      }
    });
    
  } catch (error) {
    console.error('양식 편집 처리 오류:', error);
    await interaction.reply({
      content: '양식 편집 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 필드 추가 처리 함수
async function handleAddField(interaction, serverId, formType) {
  try {
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드 ID 생성
    const fieldId = `field_${formConfig.fields.length + 1}`;
    
    // 모달 생성
    const modal = new ModalBuilder()
      .setCustomId(`form_add_field_modal_${formType}`)
      .setTitle('새 필드 추가');
    
    // 입력 필드 추가
    const labelInput = new TextInputBuilder()
      .setCustomId('label')
      .setLabel('필드 라벨')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('사용자에게 표시될 필드 이름')
      .setRequired(true);
    
    const placeholderInput = new TextInputBuilder()
      .setCustomId('placeholder')
      .setLabel('필드 플레이스홀더')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('안내 텍스트 입력')
      .setRequired(false);
    
    const styleInput = new TextInputBuilder()
      .setCustomId('style')
      .setLabel('필드 스타일')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('short 또는 paragraph')
      .setValue('short')
      .setRequired(true);
    
    const requiredInput = new TextInputBuilder()
      .setCustomId('required')
      .setLabel('필수 입력 여부')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('true 또는 false')
      .setValue('true')
      .setRequired(true);
    
      const maxLengthInput = new TextInputBuilder()
        .setCustomId('max_length')
        .setLabel('최대 길이')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('최대 글자 수 (선택사항)')
        .setRequired(false);
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(labelInput),
      new ActionRowBuilder().addComponents(placeholderInput),
      new ActionRowBuilder().addComponents(styleInput),
      new ActionRowBuilder().addComponents(requiredInput),
      new ActionRowBuilder().addComponents(maxLengthInput)
    );
    
    // 모달 표시
    await interaction.showModal(modal);
    
    // 모달 제출 대기
    const filter = (modalInteraction) => 
      modalInteraction.customId === `form_add_field_modal_${formType}`;
    
    try {
      const modalSubmission = await interaction.awaitModalSubmit({
        filter,
        time: 300000 // 5분 제한
      });
      
      // 제출된 데이터 처리
      const label = modalSubmission.fields.getTextInputValue('label');
      const placeholder = modalSubmission.fields.getTextInputValue('placeholder');
      const style = modalSubmission.fields.getTextInputValue('style').toLowerCase();
      const required = modalSubmission.fields.getTextInputValue('required').toLowerCase() === 'true';
      const maxLengthStr = modalSubmission.fields.getTextInputValue('max_length');
      
      // 새 필드 객체 생성
      const newField = {
        id: fieldId,
        label,
        style: style === 'paragraph' ? 'paragraph' : 'short',
        required,
        placeholder
      };
      
      // 최대 길이 설정 (있는 경우)
      if (maxLengthStr && !isNaN(parseInt(maxLengthStr))) {
        newField.max_length = parseInt(maxLengthStr);
      }
      
      // 필드 추가
      const updatedFields = [...formConfig.fields, newField];
      
      // 양식 구성 업데이트
      const success = await saveFormConfiguration(
        serverId, 
        formType, 
        formConfig.form_name, 
        updatedFields, 
        formConfig.designated_channel
      );
      
      if (success) {
        await modalSubmission.reply({
          content: `필드 '${label}'이(가) 성공적으로 추가되었습니다.`,
          ephemeral: true
        });
      } else {
        await modalSubmission.reply({
          content: '필드 추가 중 오류가 발생했습니다.',
          ephemeral: true
        });
      }
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('모달 제출 시간 초과');
      } else {
        console.error('모달 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('필드 추가 처리 오류:', error);
    await interaction.reply({
      content: '필드 추가 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 필드 편집 처리 함수
async function handleEditField(interaction, serverId, formType) {
  try {
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드가 없는 경우
    if (formConfig.fields.length === 0) {
      return interaction.reply({
        content: '이 양식에는 편집할 필드가 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드 선택 메뉴 생성
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`form_edit_field_select_${formType}`)
      .setPlaceholder('편집할 필드를 선택하세요')
      .addOptions(
        formConfig.fields.map(field => 
          new StringSelectMenuOptionBuilder()
            .setLabel(field.label)
            .setDescription(`필드 ID: ${field.id}`)
            .setValue(field.id)
        )
      );
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await interaction.reply({
      content: '편집할 필드를 선택하세요:',
      components: [row],
      ephemeral: true
    });
    
    // 선택 메뉴 상호작용 대기
    const filter = i => 
      i.customId === `form_edit_field_select_${formType}` && 
      i.user.id === interaction.user.id;
    
    try {
      const selection = await interaction.channel.awaitMessageComponent({
        filter,
        time: 60000 // 1분 제한
      });
      
      const selectedFieldId = selection.values[0];
      const selectedField = formConfig.fields.find(f => f.id === selectedFieldId);
      
      if (!selectedField) {
        return selection.reply({
          content: '선택한 필드를 찾을 수 없습니다.',
          ephemeral: true
        });
      }
      
      // 필드 편집 모달 생성
      const modal = new ModalBuilder()
        .setCustomId(`form_edit_field_modal_${formType}_${selectedFieldId}`)
        .setTitle(`'${selectedField.label}' 필드 편집`);
      
      // 입력 필드 추가
      const labelInput = new TextInputBuilder()
        .setCustomId('label')
        .setLabel('필드 라벨')
        .setStyle(TextInputStyle.Short)
        .setValue(selectedField.label)
        .setRequired(true);
      
      const placeholderInput = new TextInputBuilder()
        .setCustomId('placeholder')
        .setLabel('필드 플레이스홀더')
        .setStyle(TextInputStyle.Short)
        .setValue(selectedField.placeholder || '')
        .setRequired(false);
      
      const styleInput = new TextInputBuilder()
        .setCustomId('style')
        .setLabel('필드 스타일')
        .setStyle(TextInputStyle.Short)
        .setValue(selectedField.style || 'short')
        .setPlaceholder('short 또는 paragraph')
        .setRequired(true);
      
      const requiredInput = new TextInputBuilder()
        .setCustomId('required')
        .setLabel('필수 입력 여부')
        .setStyle(TextInputStyle.Short)
        .setValue(selectedField.required ? 'true' : 'false')
        .setPlaceholder('true 또는 false')
        .setRequired(true);
      
      const maxLengthInput = new TextInputBuilder()
        .setCustomId('max_length')
        .setLabel('최대 길이')
        .setStyle(TextInputStyle.Short)
        .setValue(selectedField.max_length ? selectedField.max_length.toString() : '')
        .setPlaceholder('최대 글자 수 (선택사항)')
        .setRequired(false);
      
      modal.addComponents(
        new ActionRowBuilder().addComponents(labelInput),
        new ActionRowBuilder().addComponents(placeholderInput),
        new ActionRowBuilder().addComponents(styleInput),
        new ActionRowBuilder().addComponents(requiredInput),
        new ActionRowBuilder().addComponents(maxLengthInput)
      );
      
      // 모달 표시
      await selection.showModal(modal);
      
      // 모달 제출 대기
      const modalFilter = (modalInteraction) => 
        modalInteraction.customId === `form_edit_field_modal_${formType}_${selectedFieldId}`;
      
      const modalSubmission = await interaction.awaitModalSubmit({
        filter: modalFilter,
        time: 300000 // 5분 제한
      });
      
      // 제출된 데이터 처리
      const label = modalSubmission.fields.getTextInputValue('label');
      const placeholder = modalSubmission.fields.getTextInputValue('placeholder');
      const style = modalSubmission.fields.getTextInputValue('style').toLowerCase();
      const required = modalSubmission.fields.getTextInputValue('required').toLowerCase() === 'true';
      const maxLengthStr = modalSubmission.fields.getTextInputValue('max_length');
      
      // 필드 업데이트
      const updatedFields = formConfig.fields.map(field => {
        if (field.id === selectedFieldId) {
          const updatedField = {
            ...field,
            label,
            style: style === 'paragraph' ? 'paragraph' : 'short',
            required,
            placeholder
          };
          
          // 최대 길이 설정 (있는 경우)
          if (maxLengthStr && !isNaN(parseInt(maxLengthStr))) {
            updatedField.max_length = parseInt(maxLengthStr);
          } else {
            delete updatedField.max_length;
          }
          
          return updatedField;
        }
        return field;
      });
      
      // 양식 구성 업데이트
      const success = await saveFormConfiguration(
        serverId, 
        formType, 
        formConfig.form_name, 
        updatedFields, 
        formConfig.designated_channel
      );
      
      if (success) {
        await modalSubmission.reply({
          content: `필드 '${label}'이(가) 성공적으로 업데이트되었습니다.`,
          ephemeral: true
        });
      } else {
        await modalSubmission.reply({
          content: '필드 업데이트 중 오류가 발생했습니다.',
          ephemeral: true
        });
      }
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('선택 메뉴 또는 모달 제출 시간 초과');
      } else {
        console.error('필드 편집 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('필드 편집 처리 오류:', error);
    await interaction.reply({
      content: '필드 편집 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 필드 삭제 처리 함수
async function handleRemoveField(interaction, serverId, formType) {
  try {
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드가 없는 경우
    if (formConfig.fields.length === 0) {
      return interaction.reply({
        content: '이 양식에는 삭제할 필드가 없습니다.',
        ephemeral: true
      });
    }
    
    // 필드 선택 메뉴 생성
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`form_remove_field_select_${formType}`)
      .setPlaceholder('삭제할 필드를 선택하세요')
      .addOptions(
        formConfig.fields.map(field => 
          new StringSelectMenuOptionBuilder()
            .setLabel(field.label)
            .setDescription(`필드 ID: ${field.id}`)
            .setValue(field.id)
        )
      );
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await interaction.reply({
      content: '삭제할 필드를 선택하세요:',
      components: [row],
      ephemeral: true
    });
    
    // 선택 메뉴 상호작용 대기
    const filter = i => 
      i.customId === `form_remove_field_select_${formType}` && 
      i.user.id === interaction.user.id;
    
    try {
      const selection = await interaction.channel.awaitMessageComponent({
        filter,
        time: 60000 // 1분 제한
      });
      
      const selectedFieldId = selection.values[0];
      const selectedField = formConfig.fields.find(f => f.id === selectedFieldId);
      
      if (!selectedField) {
        return selection.reply({
          content: '선택한 필드를 찾을 수 없습니다.',
          ephemeral: true
        });
      }
      
      // 확인 버튼 생성
      const confirmRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`form_remove_field_confirm_${formType}_${selectedFieldId}`)
            .setLabel('삭제 확인')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(`form_remove_field_cancel_${formType}`)
            .setLabel('취소')
            .setStyle(ButtonStyle.Secondary)
        );
      
      await selection.reply({
        content: `정말로 '${selectedField.label}' 필드를 삭제하시겠습니까?`,
        components: [confirmRow],
        ephemeral: true
      });
      
      // 버튼 상호작용 대기
      const buttonFilter = i => 
        (i.customId === `form_remove_field_confirm_${formType}_${selectedFieldId}` || 
         i.customId === `form_remove_field_cancel_${formType}`) && 
        i.user.id === interaction.user.id;
      
      const buttonInteraction = await interaction.channel.awaitMessageComponent({
        filter: buttonFilter,
        time: 60000 // 1분 제한
      });
      
      // 취소한 경우
      if (buttonInteraction.customId === `form_remove_field_cancel_${formType}`) {
        return buttonInteraction.reply({
          content: '필드 삭제가 취소되었습니다.',
          ephemeral: true
        });
      }
      
      // 필드 삭제
      const updatedFields = formConfig.fields.filter(field => field.id !== selectedFieldId);
      
      // 양식 구성 업데이트
      const success = await saveFormConfiguration(
        serverId, 
        formType, 
        formConfig.form_name, 
        updatedFields, 
        formConfig.designated_channel
      );
      
      if (success) {
        await buttonInteraction.reply({
          content: `필드 '${selectedField.label}'이(가) 성공적으로 삭제되었습니다.`,
          ephemeral: true
        });
      } else {
        await buttonInteraction.reply({
          content: '필드 삭제 중 오류가 발생했습니다.',
          ephemeral: true
        });
      }
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('선택 메뉴 또는 버튼 상호작용 시간 초과');
      } else {
        console.error('필드 삭제 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('필드 삭제 처리 오류:', error);
    await interaction.reply({
      content: '필드 삭제 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 채널 변경 처리 함수
async function handleChangeChannel(interaction, serverId, formType) {
  try {
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 모달 생성
    const modal = new ModalBuilder()
      .setCustomId(`form_change_channel_modal_${formType}`)
      .setTitle('채널 변경');
    
    // 입력 필드 추가
    const channelIdInput = new TextInputBuilder()
      .setCustomId('channel_id')
      .setLabel('채널 ID')
      .setStyle(TextInputStyle.Short)
      .setValue(formConfig.designated_channel || '')
      .setPlaceholder('예: 123456789012345678')
      .setRequired(true);
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(channelIdInput)
    );
    
    // 모달 표시
    await interaction.showModal(modal);
    
    // 모달 제출 대기
    const filter = (modalInteraction) => 
      modalInteraction.customId === `form_change_channel_modal_${formType}`;
    
    try {
      const modalSubmission = await interaction.awaitModalSubmit({
        filter,
        time: 300000 // 5분 제한
      });
      
      // 제출된 데이터 처리
      const channelId = modalSubmission.fields.getTextInputValue('channel_id');
      
      // 채널 존재 여부 확인
      const channel = interaction.client.channels.cache.get(channelId);
      if (!channel) {
        return modalSubmission.reply({
          content: '유효하지 않은 채널 ID입니다. 올바른 채널 ID를 입력하세요.',
          ephemeral: true
        });
      }
      
      // 양식 구성 업데이트
      const success = await saveFormConfiguration(
        serverId, 
        formType, 
        formConfig.form_name, 
        formConfig.fields, 
        channelId
      );
      
      if (success) {
        await modalSubmission.reply({
          content: `양식 제출 채널이 <#${channelId}>로 변경되었습니다.`,
          ephemeral: true
        });
      } else {
        await modalSubmission.reply({
          content: '채널 변경 중 오류가 발생했습니다.',
          ephemeral: true
        });
      }
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('모달 제출 시간 초과');
      } else {
        console.error('모달 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('채널 변경 처리 오류:', error);
    await interaction.reply({
      content: '채널 변경 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}

// 양식 삭제 처리 함수
async function handleFormDelete(interaction, formType) {
  try {
    // 서버 ID 가져오기
    const serverId = interaction.guildId;
    
    // 양식 구성 가져오기
    const formConfig = await getFormConfiguration(serverId, formType);
    if (!formConfig) {
      return interaction.reply({
        content: '해당 양식을 찾을 수 없습니다.',
        ephemeral: true
      });
    }
    
    // 확인 버튼 생성
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`form_delete_confirm_${formType}`)
          .setLabel('삭제 확인')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('form_delete_cancel')
          .setLabel('취소')
          .setStyle(ButtonStyle.Secondary)
      );
    
    await interaction.reply({
      content: `정말로 '${formConfig.form_name}' 양식을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      components: [row],
      ephemeral: true
    });
    
    // 버튼 상호작용 대기
    const filter = i => 
      (i.customId === `form_delete_confirm_${formType}` || i.customId === 'form_delete_cancel') && 
      i.user.id === interaction.user.id;
    
    try {
      const buttonInteraction = await interaction.channel.awaitMessageComponent({
        filter,
        time: 60000 // 1분 제한
      });
      
      // 취소한 경우
      if (buttonInteraction.customId === 'form_delete_cancel') {
        return buttonInteraction.reply({
          content: '양식 삭제가 취소되었습니다.',
          ephemeral: true
        });
      }
      
      // 양식 삭제
      const success = await deleteFormConfiguration(serverId, formType);
      
      if (success) {
        await buttonInteraction.reply({
          content: `양식 '${formConfig.form_name}'이(가) 성공적으로 삭제되었습니다.`,
          ephemeral: true
        });
      } else {
        await buttonInteraction.reply({
          content: '양식 삭제 중 오류가 발생했습니다.',
          ephemeral: true
        });
      }
      
    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        console.log('버튼 상호작용 시간 초과');
      } else {
        console.error('양식 삭제 처리 오류:', error);
      }
    }
  } catch (error) {
    console.error('양식 삭제 처리 오류:', error);
    await interaction.reply({
      content: '양식 삭제 중 오류가 발생했습니다.',
      ephemeral: true
    });
  }
}
