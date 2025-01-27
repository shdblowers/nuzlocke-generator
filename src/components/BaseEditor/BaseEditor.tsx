import * as React from 'react';

export interface BaseEditorState {
    isOpen: boolean;
}

export interface BaseEditorProps {
    name: string;
    defaultOpen?: boolean;
}

const baseEditorStyle = {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '2px',
    marginBottom: '6px',
    fontSize: '1rem',
};

export class BaseEditor extends React.Component<BaseEditorProps, BaseEditorState> {
    public static defaultProps = {
        defaultOpen: true,
    };

    public constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.defaultOpen!,
        };
    }

    private toggleEditor = (e) => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    public render() {
        return (
            <div className={`${this.props.name.toLowerCase()}-editor base-editor`}>
                <h4
                    title={`${this.state.isOpen ? 'Collapse' : 'Open'} this editor.`}
                    style={baseEditorStyle}
                    onClick={this.toggleEditor}>
                    {this.props.name}
                    <span
                        className={`bp3-icon bp3-icon-caret-${this.state.isOpen ? 'up' : 'down'}`}
                    />
                </h4>
                {this.state.isOpen ? this.props.children : null}
            </div>
        );
    }
}
