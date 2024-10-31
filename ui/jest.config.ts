// jest.config.ts
import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    coverageThreshold: {
        global: {
            lines: 80
        }
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    moduleNameMapper: { "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/assetsTransformer.ts", "\\.(css|less)$": "<rootDir>/assetsTransformer.ts" },
    verbose: true,
    automock: false,
}
export default config