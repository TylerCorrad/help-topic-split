<?php
/**
 * El patrón de inyección (escritura directa en header.inc.php con
 * marcadores) está inspirado en HannibalZA/osTicket-Custom-Code
 * https://github.com/HannibalZA/osTicket-Custom-Code
 */

require_once INCLUDE_DIR . 'class.plugin.php';

class HelpTopicSplitPlugin extends Plugin{
    var $config_class = 'HelpTopicSplitPluginConfig';

    static $tagStart = '<!-- start help-topic-split -->';
    static $tagEnd   = '<!-- end help-topic-split -->';
    function bootstrap() {
        // No se requiere ninguna acción en tiempo de ejecución: el CSS ya
        // quedó escrito físicamente en los header.inc.php al guardar la
        // configuración.
    }

        function uninstall(&$errors) {
        self::removeInjectedAssets();
        parent::uninstall($errors);
    }

    
    /**
     * Construye la URL pública hacia un archivo dentro de assets/css/,
     * usando ROOT_PATH (respeta instalaciones en subcarpetas, ej /upload/).
     */
    static function pluginAssetUrl($filename, $type) {
        $dir = basename(__DIR__);
        $file = __DIR__.'/assets/'.$type.'/'.$filename;

        if (!is_file($file))
            return null;

        return ROOT_PATH . 'include/plugins/' . $dir . '/assets/' . $type . '/' . $filename
            . '?v=' . filemtime($file);
    }
    static function buildBlock($csslink, $jslink) {
        $html = self::$tagStart . "\n";
        $html .= '<link rel= "stylesheet" type="text/css" href="'
        .Format::htmlchars($csslink) .'">' . "\n";

        $html .= '<script src="' . Format::htmlchars($jslink) . '" defer></script>' . "\n";

        $html .= self::$tagEnd . "\n";
        return $html;
    }

    /**
     * Reemplaza el bloque marcado en un archivo,
     * o lo elimina si $links está vacío.
     */
    static function patchFile($filepath, $csslink, $jslink){
        if (!is_file($filepath) || !is_writable($filepath)) {
            error_log('HelpTopicSplitPlugin: no se pudo escribir en ' . $filepath);
            return false;
        }
 
        $contents = file_get_contents($filepath);
 
        // Limpia cualquier inyección previa
        $contents = preg_replace(
            '#' . preg_quote(self::$tagStart, '#') . '(.*?)' . preg_quote(self::$tagEnd, '#') . '#s',
            '',
            $contents
        );
 
        if ($csslink and $jslink) {
            $block = self::buildBlock($csslink, $jslink);
            $contents = str_ireplace('</head>', $block . '</head>', $contents);
        }
 
        return file_put_contents($filepath, $contents) !== false;
    }

        /** Lee un booleano ya sea de un array (pre_save) o de un PluginConfig (get) */
    static function cfgBool($config, $key, $default = true) {
        if (is_array($config))
            return array_key_exists($key, $config) ? (bool) $config[$key] : $default;
        if (is_object($config) && method_exists($config, 'get'))
            return $config->get($key, $default);
        return $default;
    }

    static function patchHeaders($config) {
        $enablePlugin  = self::cfgBool($config, 'enable_plugin', true);
 
        $css    = self::pluginAssetUrl('help-topic-split.css', 'css');
        $js     = self::pluginAssetUrl('help-topic-split.js', 'js');

        if ($enablePlugin) {
            self::patchFile(INCLUDE_DIR . 'client/header.inc.php', $css, $js);
            self::patchFile(INCLUDE_DIR . 'staff/header.inc.php', $css, $js);
        } else {
            self::removeInjectedAssets();
        }

    }

    static function removeInjectedAssets() {
        self::patchFile(INCLUDE_DIR . 'client/header.inc.php', null, null);
        self::patchFile(INCLUDE_DIR . 'staff/header.inc.php', null, null);
    }
 
    function isMultiInstance() {
        return false;
    }

}