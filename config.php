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

            'enable_responsive' => new BooleanField([
                'label' => 'Activar diseño responsive',
                'default' => true,
                'hint' => 'Aplica ajustes móviles al formulario'
            ])
        ];
    }
}