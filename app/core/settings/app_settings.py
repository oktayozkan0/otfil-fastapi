from core.settings.base import BaseAppSettings
from core.settings.dev import DevSettings
from core.settings.prod import ProdSettings


class AppSettings(BaseAppSettings):
    debug: bool

    class Config:
        env_prefix = "../.env"

def get_app_settings() -> AppSettings:
    if AppSettings().debug:
        return DevSettings()
    return ProdSettings()
