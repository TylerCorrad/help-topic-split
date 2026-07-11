<?php
require_once INCLUDE_DIR . 'class.plugin.php';
require_once dirname(__FILE__) . '/class.HelpTopicSplitPlugin.php';

file_put_contents(
    '/tmp/help-topic-config.log',
    "config.php cargado\n",
    FILE_APPEND);
class HelpTopicSplitPluginConfig extends PluginConfig {

    function getOptions() {
        return array(
            'enable_plugin' => new BooleanField(array(
                'label'     => ('activar división de temas de ayuda'),
                'default' => true,
            ))
        );
    }


    function pre_save(&$config, &$errors) {
        file_put_contents('/tmp/help-topic.log',
            date('Y-m-d H:i:s') . " pre_save ejecutado\n",
            FILE_APPEND
        );

        HelpTopicSplitPlugin::patchHeaders($config);

        return true;
    }
}