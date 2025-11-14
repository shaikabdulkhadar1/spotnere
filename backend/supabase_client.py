from supabase import create_client, Client
from config import settings

class SupabaseClient:
    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            settings.validate()
            cls._instance = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset the client instance (useful for testing)"""
        cls._instance = None

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return SupabaseClient.get_client()

