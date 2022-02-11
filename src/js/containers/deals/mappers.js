/* eslint-disable no-unused-vars */
const Immutable = require('seamless-immutable');
// const flatten = require('flat');
const { unflatten } = require('flat');
const {
  has,
  findIndex,
  sortBy,
  upperFirst,
  groupBy,
  uniqBy
} = require('lodash');
const { uuid } = require('uuidv4');

export const mapFormValuesToDeal = (
  sectionStateData,
  dealConfig,
  sectionName,
  formValues
) => {
  const [selectedSection] = sectionStateData;
  const parsedFields = unflatten(formValues, {
    delimiter: '_'
  });
  // console.log('mapFormValuesToDeal', { parsedFields, formValues, sectionName, selectedSection });
  const fields = [];
  Object.entries(parsedFields).forEach((parsedField) => {
    let parsedFieldValue;
    Object.entries(parsedField[1]).forEach((parsedSingleField) => {
      const [key, value] = parsedSingleField;
      const isFieldAvailable = selectedSection.fields.find(
        (field) => field.formId === key || field.id === key
      );
      if (!isFieldAvailable) return;
      const { group } = value;
      delete value.group;
      if (Array.isArray(value)) {
        parsedFieldValue = value;
      } else if (!Array.isArray(value) && typeof value === 'object') {
        parsedFieldValue = [value];
      } else {
        parsedFieldValue = [{ data: value }];
      }
      const field = {
        ...isFieldAvailable,
        value: parsedFieldValue,
        formId: key,
        order: isFieldAvailable.order || 0,
        version: isFieldAvailable.version || 1,
        visibility: isFieldAvailable.visibility || false,
        fieldGroupId: group,
        information: value.information || null
      };
      // console.log({ key, value, parsedFieldValue, group, isFieldAvailable, field });
      fields.push(field);
    });
  });
  const section = {
    ...selectedSection,
    name: selectedSection.name || upperFirst(selectedSection.key),
    fields: sortBy(fields, 'order')
  };
  // console.log('mapFormValuesToDeal', section);
  return [{ ...section }];
};

export const mapDealToFormValues = (
  sectionName,
  dealDataSections,
  dealConfig
) => {
  // console.log(dealDataSections, dealConfig);
  const visibility = {};
  let formValues = {};
  // const section = dealDataSections && dealDataSections.find((sec) => sec.key === sectionName);
  const section = dealDataSections[0];
  if (section && section.fields && section.fields.length > 0) {
    const tempFiledObj = {};
    // const tempNewObj = {};
    section.fields.forEach((field) => {
      const currentConfig = dealConfig.find(
        (config) => config.type === field.type
      );
      // console.log('section.fields', field, currentConfig);
      const ID = field.id || field.formId;
      if (currentConfig) {
        // console.log('---->', {
        //   value: field.value,
        //   currentConfig,
        //   field
        // });
        visibility[`${currentConfig.type}_${ID}`] = field.visibility || false;
        if (currentConfig.multiple) {
          tempFiledObj[`${currentConfig.type}_${ID}`] = field.value || [];
        } else if (currentConfig.fieldType === 'group') {
          tempFiledObj[`${currentConfig.type}_${ID}`] = (field.value && field.value[0]) || {};
        } else {
          tempFiledObj[`${currentConfig.type}_${ID}`] = (field.value && field.value[0].data) || '';
        }
        tempFiledObj[`${currentConfig.type}_${ID}_group`] = field.fieldGroupId || '';
        tempFiledObj[`${currentConfig.type}_${ID}_information`] = field.information || '';
      }
    });
    //
    // formValues = flatten(tempFiledObj, {
    //   delimiter: '_',
    //   safe: true
    // });
    // formValues = { ...formValues, ...tempNewObj };
    formValues = { ...tempFiledObj };
    // console.log('mapDealToFormValues', formValues);
  }
  return { formValues, visibility };
};

export const appendFieldToSection = (
  sectionStateData,
  sectionName,
  fieldType,
  fieldLabel
) => {
  const [selectedSection] = sectionStateData;
  // console.log({ sectionName, fieldType, fieldLabel, selectedSection });
  if (selectedSection) {
    if (selectedSection.fields) {
      const newSectionFields = [
        ...selectedSection.fields,
        {
          title: fieldLabel,
          type: fieldType,
          formId: uuid(),
          order: selectedSection.fields.length + 1
        }
      ];
      return [
        {
          ...selectedSection,
          fields: newSectionFields
        }
      ];
    }
    return [
      {
        ...selectedSection,
        fields: [
          {
            title: fieldLabel,
            type: fieldType,
            formId: uuid(),
            order: 1
          }
        ]
      }
    ];
  }
  return sectionStateData;
};

export const removefieldFromSection = (
  sectionStateData,
  sectionName,
  fieldName
) => {
  const [selectedSection] = sectionStateData;
  if (selectedSection) {
    if (selectedSection.fields) {
      const fieldType = fieldName.split('_');
      const isFieldExisting = selectedSection.fields.findIndex(
        (field) => field.type === fieldType[0]
          && (field.id === fieldType[1] || field.formId === fieldType[1])
      );
      // console.log({ selectedSection, sectionName, fieldName, isFieldExisting });
      const desiredFields = [
        ...selectedSection.fields.slice(0, isFieldExisting),
        ...selectedSection.fields.slice(isFieldExisting + 1)
      ];
      return sectionStateData.map((section) => {
        const { fields, ...others } = section;
        return {
          fields: [...desiredFields],
          ...others
        };
      });
    }
    return sectionStateData;
  }
  return sectionStateData;
};

export const removeValueFromSubField = (
  sectionStateData,
  sectionName,
  fieldName,
  newValues
) => {
  const selectedSection = sectionStateData.find(
    (section) => section.key === sectionName
  );
  if (selectedSection) {
    if (selectedSection.fields) {
      const mutableSection = Immutable.asMutable(sectionStateData, { deep: true });
      const index = mutableSection.findIndex((sec) => sec.key === sectionName);
      if (index !== -1) {
        const fieldIndex = mutableSection[index].fields.findIndex(
          (res) => res.key === fieldName[0]
        );
        if (fieldName !== -1) {
          if (fieldName.length > 1) {
            // eslint-disable-next-line max-len
            const subfieldIndex = mutableSection[index].fields[
              fieldIndex
            ].value.findIndex((subfield) => has(subfield, fieldName[1]));
            if (subfieldIndex !== -1) {
              mutableSection[index].fields[fieldIndex].value[subfieldIndex][
                fieldName[1]
              ] = [...newValues];
            }
            return Immutable.asMutable(mutableSection, { deep: true });
          }
          mutableSection[index].fields[fieldIndex].value = [...newValues];
          return Immutable.asMutable(mutableSection, { deep: true });
        }
      }
    }
  }
  return selectedSection;
};
export const changeFieldVisibility = (
  sections,
  sectionName,
  fieldKey,
  visibilityValue
) => {
  const [section] = sections;
  const newFieldKey = fieldKey && fieldKey.split('_');
  const newSectionState = section.fields.map((field) => {
    if (
      field.type === newFieldKey[0]
      && (field.id === newFieldKey[1] || field.formId === newFieldKey[1])
    ) {
      return {
        ...field,
        visibility: visibilityValue
      };
    }
    return field;
  });
  return [{ ...section, fields: newSectionState }];
};

export const changeSectionVisibility = (
  sections,
  sectionName,
  visibilityValue
) => {
  const newSectionState = sections.map((section) => {
    if (section.key === sectionName) {
      const newSection = { ...section, visibility: visibilityValue };
      return newSection;
    }
    return section;
  });
  return newSectionState;
};

const getFieldVisibility = (section, fieldKey) => {
  // console.log('getFieldVisibility', section, fieldKey);
  const visibility = false;
  if (section.fields) {
    const field = section.fields.find(
      (fieldValue) => fieldValue.id === fieldKey || fieldValue.formId === fieldKey
    );
    // console.log('getFieldVisibility', { field, section, fieldKey });
    return (field && field.visibility) || visibility;
  }
  return visibility;
};

const getFieldType = (section, fieldKey) => {
  const type = 'dummyType';
  if (section.fields) {
    const field = section.fields[fieldKey];
    return field.type;
  }
  return type;
};

const getFieldTitle = (section, fieldKey) => {
  const title = '';
  if (section.fields) {
    const temp = Object.values(section.fields).find(
      (sec) => sec.type === fieldKey
    );
    // const field = section.fields[fieldKey];
    // return field.label;
    return (temp && temp.label) || '';
  }
  return title;
};

const getVersion = (section, fieldKey) => {
  const version = 1;
  if (section.fields) {
    const field = section.fields.find((data) => data.type === fieldKey);
    if (field) return field.version || 1;
    return 1;
  }
  return version;
};

const getFieldOrder = (section, fieldKey) => {
  const order = 0;
  if (section.fields) {
    const field = section.fields.find((data) => data.type === fieldKey);
    if (field) return field.order || 0;
    return 0;
  }
  return order;
};

const getSectionVisibility = (sections, sectionName) => {
  let visibility = false;
  const section = sections.find((sec) => sec.key === sectionName);
  if (section) {
    visibility = section.visibility || false;
  }
  return visibility;
};

const getSectionOrder = (section) => section.order || 0;

export const getLabelFromKey = (config, sectionName, field) => {
  const sectionArray = config[sectionName];
  const fieldValue = sectionArray.fields[field.key] || '';
  return fieldValue.label;
};

export const findActiveFieldCount = (section) => {
  let counter = 0;
  if (section.fields) {
    // eslint-disable-next-line array-callback-return
    section.fields.map((field) => {
      if (field.visibility === true) {
        counter += 1;
      }
    });
  }
  return counter;
};

export const addVersionInConfig = (dealData, sectionConfig) => {
  const updated = sectionConfig.map((config) => {
    const temp = dealData.sections.find(
      (section) => section.key === config.key
    );
    if (temp) {
      return {
        ...config,
        version: temp.version || 1,
        id: temp.id
      };
    }
    return { ...config, version: 1 };
  });
  return updated;
};

export const updateSingleDealSection = (dealSectionData, section) => {
  const tempDealSections = Immutable.asMutable(dealSectionData, { deep: true });
  const sectionIndex = findIndex(tempDealSections, { id: section.id });
  tempDealSections[sectionIndex] = section;
  return tempDealSections;
};

export const updateSingleFieldData = (sectionData, fieldData) => {
  if (sectionData && sectionData.fields && sectionData.fields.length) {
    const currentFieldIndex = sectionData.fields.findIndex((field) => field.id === fieldData.id);
    if (currentFieldIndex !== -1) {
      const mutableSection = Immutable.asMutable(sectionData, { deep: true });
      mutableSection.fields[currentFieldIndex] = fieldData;
      return mutableSection;
    }
    return sectionData;
  }
  return sectionData;
};

export const updateFieldLabel = (sectionData, fieldKey, newLabel) => {
  const [type, id] = fieldKey.split('_');
  const newFieldsData = sectionData.fields.map((field) => {
    if (field.type === type && (field.id === id || field.formId === id)) {
      return {
        ...field,
        title: newLabel
      };
    }
    return field;
  });

  return {
    ...sectionData,
    fields: newFieldsData
  };
};

export const updateFieldInfoText = (sectionData, fieldKey, infoText) => {
  const [type, id] = fieldKey.split('_');
  const newFieldsData = sectionData.fields.map((field) => {
    if (field.type === type && (field.id === id || field.formId === id)) {
      return {
        ...field,
        information: infoText
      };
    }
    return field;
  });
  return {
    ...sectionData,
    fields: newFieldsData
  };
};

export const getGroups = (sectionData) => {
  const sortedFields = sortBy(sectionData.fields, 'order');
  const groupValues = groupBy(sortedFields, 'fieldGroupId');
  const dataWithOrdered = {
    ...sectionData,
    fields: Object.values(groupValues).flat()
  };
  const groups = uniqBy(sortedFields, 'fieldGroupId').map((s) => (s.fieldGroupId)).filter(Boolean);
  return { data: dataWithOrdered, groups };
};

export const reOrderFields = (sectionData, sourceIndex, destinationIndex) => {
  // const section = sectionData.asMutable({ deep: true });
  const section = Immutable.asMutable(sectionData, { deep: true });
  const [removed] = section.fields.splice(sourceIndex, 1);
  section.fields.splice(destinationIndex, 0, removed);
  section.fields = section.fields.map((field, index) => ({
    ...field,
    order: index + 1
  }));
  // console.log({ sectionData, section, final: Immutable(section), sourceIndex, destinationIndex, removed });
  return Immutable(section, { deep: true });
};

export const reOrderSectionFields = (sectionData) => ({
  ...sectionData,
  fields: sortBy(sectionData.fields, 'order')
});

/**
 * @param {array} sectionStateData
 * @param dealConfig
 * @param sectionName
 * @param formValues
 * @returns {*[]}
 * @deprecated
 */
export const mapFormValuesToDealOld = (
  sectionStateData,
  dealConfig,
  sectionName,
  formValues
) => {
  const selectedSection = sectionStateData.find(
    (sec) => sec.key === sectionName
  );
  const parsedFields = unflatten(formValues, {
    delimiter: '_'
  });
  const fields = [];
  Object.keys(parsedFields).forEach((parsedField) => {
    if (!parsedFields[parsedField]) return;
    let parsedFieldValue;
    if (Array.isArray(parsedFields[parsedField])) {
      parsedFieldValue = parsedFields[parsedField];
    } else if (
      !Array.isArray(parsedFields[parsedField])
      && typeof parsedFields[parsedField] === 'object'
    ) {
      parsedFieldValue = [parsedFields[parsedField]];
    } else {
      parsedFieldValue = [{ data: parsedFields[parsedField] }];
    }
    const field = {
      key: parsedField,
      visibility: getFieldVisibilityOld(selectedSection, parsedField),
      type: getFieldTypeOld(dealConfig[sectionName], parsedField),
      title: getFieldTitleOld(dealConfig[sectionName], parsedField),
      value: parsedFieldValue,
      order: getFieldOrderOld(dealConfig[sectionName], parsedField),
      version: dealConfig[sectionName].version || 1
    };
    fields.push(field);
  });

  const section = {
    key: sectionName,
    id: selectedSection.id,
    version: selectedSection.version || 1,
    visibility: getSectionVisibilityOld(sectionStateData, sectionName),
    order: getSectionOrderOld(dealConfig[sectionName]),
    fields
  };
  const existingSectionIndex = sectionStateData.findIndex(
    (sec) => sec.key === sectionName
  );
  if (existingSectionIndex > -1) {
    const newSectionStateData = sectionStateData.filter(
      (sec, index) => index !== existingSectionIndex
    );
    return [...newSectionStateData, { ...section }];
  }
  return [...sectionStateData, { ...section }];
};

/**
 * @description Maps Deal to form values
 * @param sectionName
 * @param dealDataSections
 * @param dealConfig
 * @returns {{formValues: {}, visibility: {}}}
 * @deprecated
 */
export const mapDealToFormValuesOld = (
  sectionName,
  dealDataSections,
  dealConfig
) => {
  const visibility = {};
  let formValues = {};
  const section = dealDataSections && dealDataSections.find((sec) => sec.key === sectionName);
  if (section && section.fields && section.fields.length > 0) {
    const tempFiledObj = {};
    section.fields.forEach((field) => {
      visibility[field.key] = field.visibility || false;
      if (
        dealConfig[sectionName]
        && dealConfig[sectionName].fields
        && dealConfig[sectionName].fields[field.key]
      ) {
        if (dealConfig[sectionName].fields[field.key].valueType === 'array') {
          tempFiledObj[field.key] = field.value || [];
        } else if (
          dealConfig[sectionName].fields[field.key].valueType === 'object'
        ) {
          tempFiledObj[field.key] = (field.value && field.value[0]) || {};
        } else {
          tempFiledObj[field.key] = (field.value && field.value[0].data) || '';
        }
      }
    });
    formValues = { ...tempFiledObj };
  }
  return { formValues, visibility };
};

export const appendFieldToSectionOld = (
  sectionStateData,
  sectionName,
  fieldName
) => {
  const selectedSection = sectionStateData.find(
    (section) => section.key === sectionName
  );
  if (selectedSection) {
    if (selectedSection.fields) {
      const isFieldExisting = selectedSection.fields.find(
        (field) => field.key === fieldName
      );
      if (isFieldExisting) {
        return sectionStateData;
      }
      const newSectionFields = [...selectedSection.fields, { key: fieldName }];
      const newSectionStateData = sectionStateData.map((section) => {
        if (section.key === sectionName) {
          const { fields, ...others } = section;
          return {
            fields: [...newSectionFields],
            ...others
          };
        }
        return { ...section };
      });
      return newSectionStateData;
    }
    const newSectionStateData = [
      {
        ...selectedSection,
        fields: [{ key: fieldName }]
      }
    ];

    return newSectionStateData;
  }
  return [
    ...sectionStateData,
    {
      key: sectionName,
      fields: [
        {
          key: fieldName
        }
      ]
    }
  ];
};

export const removefieldFromSectionOld = (
  sectionStateData,
  sectionName,
  fieldName
) => {
  const selectedSection = sectionStateData.find(
    (section) => section.key === sectionName
  );
  if (selectedSection) {
    if (selectedSection.fields) {
      const isFieldExisting = selectedSection.fields.findIndex(
        (field) => field.key === fieldName
      );
      const desiredFields = [
        ...selectedSection.fields.slice(0, isFieldExisting),
        ...selectedSection.fields.slice(isFieldExisting + 1)
      ];
      const newSectionStateData = sectionStateData.map((section) => {
        if (section.key === sectionName) {
          const { fields, ...others } = section;
          return {
            fields: [...desiredFields],
            ...others
          };
        }
        return { ...section };
      });
      return newSectionStateData;
    }
    return sectionStateData;
  }
  return sectionStateData;
};

export const changeFieldVisibilityOld = (
  sections,
  sectionName,
  fieldKey,
  visibilityValue
) => {
  const newSectionState = sections.map((section) => {
    if (section.key === sectionName) {
      const newFieldData = section.fields.map((field) => {
        if (field.key === fieldKey) {
          return {
            ...field,
            visibility: visibilityValue
          };
        }
        return field;
      });
      const newSection = { ...section, fields: newFieldData };
      return newSection;
    }
    return section;
  });
  return newSectionState;
};

export const changeSectionVisibilityOld = (
  sections,
  sectionName,
  visibilityValue
) => {
  const newSectionState = sections.map((section) => {
    if (section.key === sectionName) {
      const newSection = { ...section, visibility: visibilityValue };
      return newSection;
    }
    return section;
  });
  return newSectionState;
};

const getFieldVisibilityOld = (section, fieldKey) => {
  const visibility = false;
  if (section.fields) {
    const field = section.fields.find(
      (fieldValue) => fieldValue.key === fieldKey
    );
    return (field && field.visibility) || visibility;
  }
  return visibility;
};

const getFieldTypeOld = (section, fieldKey) => {
  const type = 'dummyType';
  if (section.fields) {
    const field = section.fields[fieldKey];
    return field.type;
  }
  return type;
};

const getFieldTitleOld = (section, fieldKey) => {
  const title = '';
  if (section.fields) {
    const field = section.fields[fieldKey];
    return field.label;
  }
  return title;
};

const getFieldOrderOld = (section, fieldKey) => {
  const order = 0;
  if (section.fields) {
    const field = section.fields[fieldKey];
    return field.order || 0;
  }
  return order;
};

const getSectionVisibilityOld = (sections, sectionName) => {
  let visibility = false;
  const section = sections.find((sec) => sec.key === sectionName);
  if (section) {
    visibility = section.visibility || false;
  }
  return visibility;
};

const getSectionOrderOld = (section) => section.order || 0;
