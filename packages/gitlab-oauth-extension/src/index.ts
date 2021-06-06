import { JupyterFrontEndPlugin, JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { PkceAuthenticator } from 'netlify-cms-lib-auth';

// step 1: actually perform auth song and dance
//  => OK, though unpleaseant (full reload...)
// ??? - needs sub-steps (plugin organization, ...)
// step 2-3: configuration?
// step 2-3: routing?
// step 4: provides - consuming auth token from other extension
// other steps: refresh, git, contents manager...
const PLUGIN_ID = '@jupyterlite/gitlab-oauth-extension:gitlab-oauth';

const gitlab_oauth_plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  requires: [ISettingRegistry],

  activate: async (app: JupyterFrontEnd, settings: ISettingRegistry) => {
    console.log('Starting gitlab-oauth-extension');

    // Using Promise.all as suggested in https://github.com/jupyterlab/extension-examples/tree/master/settings hangs...
    //const [, setting] = await Promise.all([app.restored, settings.load(PLUGIN_ID)]);
    const setting = await settings.load(PLUGIN_ID);
    const base_url = setting.get('base_url').composite as string;
    const app_id = setting.get('app_id').composite as string;
    if (app_id === undefined) {
      throw new Error('Cannot authenticate without an app_id');
    }

    const auth = new PkceAuthenticator({
      base_url,
      auth_endpoint: 'oauth/authorize',
      app_id,
      auth_token_endpoint: 'oauth/token'
    });

    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      auth.completeAuth(console.log);
      console.log('Completed authentication');
      // pass token to GitBeaker and roll!
    } else {
      // initiate authentication, unless we're in the callback route
      auth.authenticate({ provider: 'gitlab', scope: 'api' });
    }
  },

  autoStart: true
};

const plugins: JupyterFrontEndPlugin<any>[] = [gitlab_oauth_plugin];

export default plugins;
