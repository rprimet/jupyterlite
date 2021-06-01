import { JupyterFrontEndPlugin, JupyterFrontEnd } from '@jupyterlab/application';

const gitlab_oauth_plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlite/gitlab-oauth-extension',

  activate: (app: JupyterFrontEnd) => {
    console.log('starting gitlab-oauth-extension');
  },

  autoStart: true
};

const plugins: JupyterFrontEndPlugin<any>[] = [gitlab_oauth_plugin];

export default plugins;
