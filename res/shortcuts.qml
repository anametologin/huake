import QtQuick;
import org.kde.kwin;

Item {
    id: shortcuts;

    function getToggleFirst() {
        return toggleFirst;
    }
    ShortcutHandler {
        id: toggleFirst;

        name: "HuakeToggleFirst";
        text: "Huake: Toggle first window with class 'huake1'";
        sequence: "Meta+F1";
    }
    function getToggleSecond() {
        return toggleSecond;
    }
    ShortcutHandler {
        id: toggleSecond;

        name: "HuakeToggleSecond";
        text: "Huake: Toggle second window with class 'huake2'";
        sequence: "Meta+F2";
    }
}
