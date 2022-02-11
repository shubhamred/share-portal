import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const RichTextEditorComponent = (props) => {
  const { label, input, meta, propValue, onValueChange, isRequiredField, disabled = false } = props;
  const { initial } = meta || {};
  const { onChange, value } = input || {};

  const handleEditorChange = (content) => {
    // console.log(editorRef);
    if (input) {
      onChange(content);
    } else {
      onValueChange(content);
    }
  };

  return (
    <Grid container={true} className={styles.container}>
      {label
      && (
        <Grid className={styles.label} item={true} xs={12}>

          {label}
          {isRequiredField ? (
            <span className={styles.requiredStar}>*</span>
          ) : null}
        </Grid>
      )}
      <Grid item={true} xs={12}>
        <div className={styles.editorContainer}>
          <Editor
            initialValue={initial}
            value={value || propValue}
            onEditorChange={handleEditorChange}
            plugins="table code lists image link preview"
            toolbar="undo redo | styleselect | bold italic | link image| numlist bullist | preview"
            disabled={disabled}
            init={{
              // plugins: 'table code lists image link preview paste',
              content_style: '*, body { font-family: "Open Sans", sans-serif !important; }',
              paste_text_sticky_default: true,
              paste_as_text: true,
              font_formats:
    'Open Sans, sans-serif; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

RichTextEditorComponent.propTypes = {
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  propValue: PropTypes.string,
  onValueChange: PropTypes.func
};

RichTextEditorComponent.defaultProps = {
  label: null,
  input: null,
  meta: null,
  propValue: null,
  onValueChange: () => {}
};

export default React.memo(RichTextEditorComponent);
