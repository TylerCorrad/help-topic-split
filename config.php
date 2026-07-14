<?php
require_once INCLUDE_DIR . 'class.plugin.php';


class HelpTopicSplitConfig extends PluginConfig {

    function getOptions() {
        return [
            'general' => new SectionBreakField([
                'label' => 'Configuración general',
            ]),

            'enable_subtopics' => new BooleanField([
                'label' => 'Activar subcategorías',
                'default' => true,
                'hint' => 'Habilita el segundo dropdown',
            ]),
        ];
    }

    function pre_save(&$config, &$errors) {
        file_put_contents(
            HELP_TOPIC_SPLIT_LOG_DIR . '/help-topic.log',
            date('Y-m-d H:i:s') . " pre_save ejecutado\n",
            FILE_APPEND
        );

        HelpTopicSplitPlugin::patchHeaders($config);

        return true;
    }
}