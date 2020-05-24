import * as React from 'react';
import { connect } from 'react-redux';

import * as Loadable from 'react-loadable';

import './app.styl';
import { Hotkeys } from 'components/Hotkeys';
import { State } from 'state';
import { injectGlobal } from 'emotion';

export interface AppProps {
    game: any;
    style: any;
    rules: any;
    disableHotkeys?: boolean;
}

function Loading() {
    return <div>Loading...</div>;
}

const Editor = Loadable({
    loader: () => import('components/Editor'),
    loading: Loading,
    render(loaded) {
        return <loaded.Editor />;
    },
});

const Result = Loadable({
    loader: () => import('components/Result'),
    loading: Loading,
    render(loaded) {
        return <loaded.Result />;
    },
});

export class AppBase extends React.PureComponent<AppProps> {
    constructor(props: any) {
        super(props);
    }

    public static defaultProps = {
        disableHotkeys: false,
    };

    public render() {
        const {style} = this.props;
        return (
            <div className='app' role='main' style={{
                background: style.editorDarkMode ? '#111' : '#fff',
            }}>
                {this.props.disableHotkeys ? null : <Hotkeys />}
                <Editor />
                <Result />
            </div>
        );
    }
}

export const App = connect(
    (state: Pick<State, keyof State>) => ({
        game: state.game,
        style: state.style,
        rules: state.rules,
    }),
    {
    },
)(AppBase);
