import { Flex } from "antd"

const siteUrl = "otfil.com";
const companyName = "FibGate";
const countryState = "Türkiye/Antalya";
const contactMail = "support@otfil.com"

const TermsAndConditions_en = () => {
    return (
        <Flex vertical>
            <h2>Terms And Conditions</h2>
            <span> {`Welcome to ${siteUrl}! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.`}</span>

        </Flex >
    )
}


const TermsAndConditions_tr = () => {
    return (
        <Flex vertical>
            <h2>Şartlar ve Koşullar</h2>
            <span> {`${siteUrl}'a hoş geldiniz! Web sitemize erişerek veya kullanarak, aşağıdaki şartlar ve koşullara uymayı ve bunlarla bağlı olmayı kabul ediyorsunuz. Lütfen hizmetlerimizi kullanmadan önce bunları dikkatlice okuyun.`}</span>

        </Flex >
    )
}

const PrivacyPolicy_en = () => {
    return (
        <Flex vertical>
            <h2>Privacy Policy</h2>
            <span>{`At ${companyName}, we highly value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect the information gathered through our website or services.`}</span>
            <br />
            <strong>Information We Collect</strong>
            <span>We may collect personal data in various ways. The data collected can fall into the following categories:</span>
            <ul style={{ listStyle: "inside" }}>
                <li style={{ listStyle: "unset" }}>
                    Identity Information: Name, surname, email address, phone number.
                </li>
                <li style={{ listStyle: "unset" }}>
                    Contact Information: Address, email address, phone number.
                </li>
                <li style={{ listStyle: "unset" }}>
                    Usage Data: Information related to your use of our website, IP address, browser details.
                </li>
                <li style={{ listStyle: "unset" }}>
                    Cookies and Tracking Technologies: Usage data collected through cookies, pixel tags, and similar technologies.
                </li>
            </ul>

        </Flex >
    )
}

const PrivacyPolicy_tr = () => {
    return (
        <Flex vertical>
            <h2>Gizlilik Politikası</h2>
            <span>{`${companyName} olarak, gizliliğinize ve kişisel verilerinizin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemiz veya hizmetlerimiz aracılığıyla topladığımız bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.`}</span>
            <br />
            <strong>Topladığımız Bilgiler</strong>
            <span>Kişisel verilerinizi çeşitli şekillerde toplayabiliriz. Toplanan veriler aşağıdaki kategorilerde olabilir:</span>
            <ul style={{ listStyle: "inside" }}>
                <li style={{ listStyle: "unset" }}>
                    Kimlik Bilgileri: Ad, soyad, e-posta adresi, telefon numarası.
                </li>
                <li style={{ listStyle: "unset" }}>
                    İletişim Bilgileri: Adres, e-posta adresi, telefon numarası.
                </li>
                <li style={{ listStyle: "unset" }}>
                    Kullanım Verileri: Web sitemizi kullanımınıza ilişkin bilgiler, IP adresi, tarayıcı bilgileri.
                </li>
                <li style={{ listStyle: "unset" }}>
                    Çerezler ve İzleme Teknolojileri: Çerezler, piksel etiketleri ve benzeri teknolojiler aracılığıyla kullanım bilgileri.
                </li>
            </ul>

        </Flex >
    )
}


export { TermsAndConditions_en, TermsAndConditions_tr, PrivacyPolicy_en, PrivacyPolicy_tr };
