import * as React from 'react';
import { Dialog, IDialogProps, Classes, Button } from '@blueprintjs/core';
import { cx } from 'emotion';
import * as styles from 'components/Result/styles';
import { generateReleaseNotes, releaseNotes, Styles, classWithDarkTheme } from 'utils';
import { pkg } from 'package';
import * as ReactMarkdown from 'react-markdown';
import { tail } from 'ramda';

const croagunk = require('assets/img/croagunk.gif');

export interface ReleaseDialogProps {
    onClose: (e?: React.SyntheticEvent) => void;
    style: Styles;
}

export class ReleaseDialog extends React.Component<
IDialogProps & ReleaseDialogProps,
{ seePrevious?: boolean }
> {
    public state = {
        seePrevious: false,
    };

    public render() {
        const { seePrevious } = this.state;

        return (
            <Dialog
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                icon="document"
                title={`Release Notes ${pkg.version}`}
                className={`release-dialog ${
                    this.props.style.editorDarkMode ? 'pt-dark' : 'pt-light'
                }`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className="release-notes-wrapper">
                        <h3
                            className={cx(
                                classWithDarkTheme(
                                    styles,
                                    'heading',
                                    this.props.style.editorDarkMode,
                                ),
                            )}>
                            {pkg.version}{' '}
                            <img style={{ display: 'inline' }} alt="Croagunk" src={croagunk} />
                        </h3>
                        <ReactMarkdown
                            className="release-notes"
                            source={generateReleaseNotes(pkg.version)}
                        />
                        <Button
                            onClick={(e) => this.setState({ seePrevious: !this.state.seePrevious })}
                            icon={seePrevious ? 'symbol-triangle-up' : 'symbol-triangle-down'}>
                            Previous Relase Notes
                        </Button>
                        {seePrevious &&
                            tail(Object.keys(releaseNotes).reverse()).map((key) => {
                                return (
                                    <ReactMarkdown
                                        key={key}
                                        className="release-notes"
                                        source={`#### ${key}\n${generateReleaseNotes(key)}`}
                                    />
                                );
                            })}
                    </div>
                </div>
            </Dialog>
        );
    }
}
