import { Button } from "antd";
import { useEffect, useState } from "react";

export const StoryPage = () => {
    const [text, setText] = useState(""); // Yazıyı ekrana sırayla yazmak için
    const [isTyping, setIsTyping] = useState(true); // Yazı bitiş durumu
    const [choices, setChoices] = useState([
        { text: "Seçenek 1", nextScene: "scene1" },
        { text: "Seçenek 2", nextScene: "scene2" },
    ]); // Örnek seçenekler
    const [countdown, setCountdown] = useState(8); // Geri sayım süresi
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null); // Seçili seçenek
    const [hoveredChoice, setHoveredChoice] = useState<number | null>(null); // Hovered choice state

    const storyText = "Bu bir sahne örneğidir. Yazı typewriter efektiyle yazılıyor...";

    // Yazıyı typewriter efektiyle yaz
    useEffect(() => {
        if (isTyping) {
            let i = 0;
            const interval = setInterval(() => {
                setText((prev) => prev + storyText[i]);
                i++;
                if (i >= storyText.length) {
                    clearInterval(interval);
                    setIsTyping(false); // Yazı bitiş durumu
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isTyping, storyText]);

    // Geri sayım ve otomatik seçim
    useEffect(() => {
        if (!isTyping && countdown > 0) {
            const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
        if (countdown === 0 && selectedChoice === null) {
            setSelectedChoice(0); // İlk seçeneği seç
        }
    }, [isTyping, countdown, selectedChoice]);

    // Yazıyı hızlandır
    const speedUpTyping = () => {
        if (isTyping) {
            setText(storyText);
            setIsTyping(false);
        }
    };

    // Seçim yapıldığında işlem
    const handleChoice = (index: number) => {
        setSelectedChoice(index);
        alert(`Seçilen: ${choices[index].text}`);
    };

    // Buton stilini değiştiren fonksiyon
    const getButtonStyle = (index: number) => {
        const isDefaultChoice = selectedChoice === null && countdown <= 0;
        const isSelected = selectedChoice === index;
        const isHovered = hoveredChoice === index;

        return {
            margin: "5px",
            backgroundColor: isSelected || isDefaultChoice || isHovered
                ? "#ff4757"  // Alarm rengi ve seçilen renk
                : "#444",    // Diğer buton rengi
            color: "#fff",
            border: "none",
            width: isDefaultChoice || isSelected || isHovered ? "250px" : "200px", // Büyütme işlemi
            height: isDefaultChoice || isSelected || isHovered ? "60px" : "50px", // Yükseklik artırma
            transition: "all 0.3s ease-in-out", // Yavaşça büyüme ve renk değişimi
        };
    };

    return (
        <div
            style={{
                backgroundColor: "#1a1a1d",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                textAlign: "center",
            }}
            onClick={speedUpTyping} // Ekrana tıklayınca yazı hızlanır
        >
            {/* İlerleme Çubuğu */}
            {!isTyping && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "10px",
                        backgroundColor: "#444",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            height: "10px",
                            backgroundColor: "#ff4757",
                            width: `${((8 - countdown) / 8) * 50}%`, // Sağdan büyüyen kısım
                            right: 0,
                            transition: "width 1s linear",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            height: "10px",
                            backgroundColor: "#ff4757",
                            width: `${((8 - countdown) / 8) * 50}%`, // Soldan büyüyen kısım
                            left: 0,
                            transition: "width 1s linear",
                        }}
                    />
                </div>
            )}
            <div style={{ fontSize: "24px", marginBottom: "20px" }}>{text}</div>
            {!isTyping && (
                <div style={{ marginBottom: "20px" }}>
                    {choices.map((choice, index) => (
                        <Button
                            key={index}
                            onClick={() => handleChoice(index)}
                            style={getButtonStyle(index)} // Buton stilini seç
                            onMouseEnter={() => setHoveredChoice(index)} // Hover etkinliği
                            onMouseLeave={() => setHoveredChoice(null)} // Hover çıkışı
                        >
                            {choice.text}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};