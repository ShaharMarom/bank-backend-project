export const mockRedisClient = {
    connect: async () => {},
    quit: async () => {},
    set: async (key: string, value: string) => 'OK',
    get: async (key: string) => null,
    del: async (key: string) => 1,
    isOpen: true
}; 