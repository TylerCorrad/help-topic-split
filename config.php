<?php
require_once INCLUDE_DIR . 'class.plugin.php';

class HelpTopicSplitConfig extends PluginConfig {

    function getOptions() {
        return [
            'general' => new SectionBreakField([
                'label' => 'Configuración general'
            ]),

            'enable_subtopics' => new BooleanField([
                'label' => 'Activar subcategorías',
                'default' => true,
                'hint' => 'Habilita el segundo dropdown'
            ]),
        ];
    }
}