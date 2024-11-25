import React, { useState } from "react";
import { Button } from "antd";
import { StoryPage } from "./StoryPage";
import SettingsModal from "../../components/settings/SettingsModal";

const GameScreen = () => {
    const [gameStarted, setGameStarted] = useState(false); // Manage game start state
    const [isSettingsVisible, setIsSettingsVisible] = useState(false); // Manage modal visibility

    // Handle starting the game
    const startGame = () => {
        setGameStarted(true);
    };

    const showSettings = () => {
        setIsSettingsVisible(true); // Show settings modal
    };

    const closeSettings = () => {
        setIsSettingsVisible(false); // Close settings modal
    };

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#1a1a1d",
                color: "#fff",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            {!gameStarted ? (
                <>
                    <div
                        style={{
                            width: "50%",
                            height: "100%",
                            backgroundImage: "url('your-image-path.jpg')", // Replace with your image URL
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div
                        style={{
                            width: "50%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Button
                            type="primary"
                            style={{
                                marginBottom: "20px",
                                backgroundColor: "#ff4757",
                                borderColor: "#ff4757",
                            }}
                            onClick={startGame}
                        >
                            Play
                        </Button>
                        <Button
                            style={{
                                marginBottom: "20px",
                                backgroundColor: "#444",
                                borderColor: "#444",
                            }}
                            onClick={showSettings} // Show settings modal
                        >
                            Settings
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#444",
                                borderColor: "#444",
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </>
            ) : (
                // Show the game screen once the game starts
                <StoryPage />
            )}

            {/* Settings Modal */}
            <SettingsModal
                visible={isSettingsVisible}
                onClose={closeSettings}
            />
        </div>
    );
};

export default GameScreen;
