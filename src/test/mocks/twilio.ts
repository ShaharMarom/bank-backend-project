export const mockTwilioClient = {
    verify: {
        v2: {
            services: (serviceSid: string) => ({
                verifications: {
                    create: async ({ to, channel }: { to: string; channel: string }) => ({
                        status: 'pending',
                        to,
                        channel
                    })
                },
                verificationChecks: {
                    create: async ({ to, code }: { to: string; code: string }) => ({
                        status: 'approved',
                        to,
                        valid: true
                    })
                }
            })
        }
    }
}; 