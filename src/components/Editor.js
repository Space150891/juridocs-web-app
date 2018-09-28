import React, { Component } from 'react';
import TinyMCE from 'react-tinymce';

class Editor extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
    	let editor = tinymce.EditorManager.get(this.refs.editor.id);
        if (editor && editor.getContent() !== nextProps.content) {
          editor.setContent(nextProps.content)
        }
    }

    render() {
        return (
            <TinyMCE
            	ref="editor"
                content={ this.props.content }
                config={{
                    plugins: 'link code paste',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright code',
                    height: this.props.height || 400,
                }}
                onChange={ this.props.handleChange }
            />
        );
    }

}

Editor.propTypes = {
    handleChange: React.PropTypes.func.isRequired,
    height: React.PropTypes.number,
}

export default Editor;