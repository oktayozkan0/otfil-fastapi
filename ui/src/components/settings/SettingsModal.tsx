import React, { useState } from "react";
import { Modal, InputNumber, Button } from "antd";
import { useDispatch } from "react-redux";
import { setSettings } from "../../store/SiteSlice";
import { mdlSettings } from "../../models/ui-models/Settings";


type SettingsModalProps = {
    visible: boolean;
    onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [textSize, setTextSize] = useState(16); // Default value
    const [countDown, setCountDown] = useState(8); // Default value

    const handleSave = () => {
        const settings: mdlSettings = { textSize, countDown };
        dispatch(setSettings(settings)); // Dispatch Redux action
        onClose(); // Close modal after saving
    };

    return (
        <Modal
            title="Settings"
            visible={visible}
            onCancel={onClose}
            onOk={handleSave}
            okText="Save"
            cancelText="Cancel"
        >
            <div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Text Size</label>
                    <InputNumber
                        min={10}
                        max={30}
                        value={textSize}
                        onChange={(value) => setTextSize(value!)}
                        style={{ marginLeft: "10px" }}
                    />
                </div>
                <div>
                    <label>Countdown Timer</label>
                    <InputNumber
                        min={5}
                        max={15}
                        value={countDown}
                        onChange={(value) => setCountDown(value!)}
                        style={{ marginLeft: "10px" }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
