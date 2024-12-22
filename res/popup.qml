import QtQuick 2.15
import QtQuick.Controls 2.15
import org.kde.plasma.core as PlasmaCore;

/*
 * Component Documentation
 *  - PlasmaCore global `theme` object:
 *      https://techbase.kde.org/Development/Tutorials/Plasma2/QML2/API#Plasma_Themes
 *  - PlasmaCore.Dialog:
 *      https://techbase.kde.org/Development/Tutorials/Plasma2/QML2/API#Top_Level_windows
 */

PlasmaCore.Dialog {
    id: popupDialog
    type: PlasmaCore.Dialog.OnScreenDisplay
    flags: Qt.Popup | Qt.WindowStaysOnTopHint
    location: PlasmaCore.Types.Floating
    outputOnly: true

    visible: false

    mainItem: Item {
        width: messageLabel.implicitWidth
        height: messageLabel.implicitHeight



        Label {
            id: messageLabel
            padding: 10

            font.pointSize: Math.round(20)
            font.weight: Font.Bold
            color: "black"
            background: Rectangle {
                // color: "yellow"
                width: parent.width
                height: parent.height
            }
        }

        /* hides the popup window when triggered */
        Timer {
            id: hideTimer
            repeat: false

            onTriggered: {
                popupDialog.visible = false;
                popupDialog.destroy();
            }
        }
    }


    function show(text, x,y, duration) {
        hideTimer.stop();

        messageLabel.text = text;

        this.x = x;
        this.y = y;
        this.visible = true;
        hideTimer.interval = duration;
        hideTimer.start();
    }

    function hide(){
        popupDialog.visible = false;
    }
}
