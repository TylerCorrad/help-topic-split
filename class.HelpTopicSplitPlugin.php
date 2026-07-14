<?php
class HelpTopicSplitPlugin extends Plugin
{
    
    function bootstrap() {
        if (!defined('INCLUDE_DIR') || $this->isStaff())
            return;

            // Inyectar JS
            echo '<script src="include/plugins/help-topic-split/assets/js/test.js"></script>';

            // Inyectar CSS
            echo '<link rel="stylesheet" href="include/plugins/help-topic-split/assets/css/test.css">';

    }

    function onPageLoad($page)
    {

        if (basename($_SERVER['PHP_SELF']) !== 'open.php')
            return;

        global $ost;

        if ($ost) {

            $script = <<<HTML
<script>
document.addEventListener("DOMContentLoaded", function() {
    console.log("PLUGIN FUNCIONANDO");
    document.body.style.border = "5px solid green";
});
</script>
HTML;

            $ost->addExtraHeader($script);
        }
    }
}