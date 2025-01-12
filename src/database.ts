import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from './settings';


export class User {
    childUuid: string;
    parentUuid: string;
    createdAt: Date;
    name: string;
    lastUsedAt: Date | null;

    constructor(data: any) {
        this.childUuid = data['child_uuid'];
        this.parentUuid = data['parent_uuid'];
        this.createdAt = new Date(data['created_at']);
        this.name = data['name'];
        this.lastUsedAt = data['last_used_at'] ? new Date(data['last_used_at']) : null;
    }
}

export class Config {
    uuid: string;
    hiddifyOpenUrl: string;
    hiddifySubscriptionUrl: string;

    constructor(data: any) {
        this.uuid = data['uuid'];
        this.hiddifySubscriptionUrl = `https://${location.host}/${this.uuid}/hiddify`;
        this.hiddifyOpenUrl = `hiddify://import/${this.hiddifySubscriptionUrl}`;
    }
}

export class Database {
    private supabase: ReturnType<typeof createClient>;
    private uuid: string;
    isPasswordSetupNeeded: boolean;
    
    constructor(supabase: ReturnType<typeof createClient>, uuid: string, isPasswordSetupNeeded: boolean) {
        this.supabase = supabase;
        this.uuid = uuid;
        this.isPasswordSetupNeeded = isPasswordSetupNeeded;
    }

    static async connect(uuid: string, password: string): Promise<Database> {
        const supabase = createClient<Database>(supabaseUrl, supabaseKey);
        await supabase.auth.signOut({ scope: 'local' });
        await supabase.auth.signInWithPassword({
            email: `${uuid}@example.com`,
            password,
        });
        return new Database(supabase, (await supabase.auth.getUser()).data.user.id, password === uuid);
    }

    async fetchChildren(): Promise<{ children: User[], count: number }> {
        const { data, error, count } = await this.supabase.from('users').select('*', { count: 'exact' });
        if (error) {
            throw error;
        }
        return {
            children: data.map(rawValue => new User(rawValue)),
            count,
        };
    }

    async adopt(name: string): Promise<number> {
        const { data, error } = await this.supabase.functions.invoke('adopt', {
            body: { parentUuid: this.uuid, name }
        });
        if (error) {
            throw error;
        }
        return data.code;
    }

    async renameConfig(childUuid: string, name: string): Promise<void> {
        const { error } = await this.supabase.from('users').update({ name }).eq('child_uuid', childUuid);
        if (error) {
            throw error;
        }
    }

    async changePassword(password: string): Promise<void> {
        const { error } = await this.supabase.auth.updateUser({ password });
        if (error) {
            throw error;
        }
        this.isPasswordSetupNeeded = password === this.uuid;
    }

    async fetchConfig(): Promise<Config> {
        const { data, error } = await this.supabase.from('configs').select('*').single();
        if (error) {
            throw error;
        }
        return new Config(data);
    }
}
