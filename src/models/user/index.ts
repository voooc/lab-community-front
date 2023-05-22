/**
 * @description: Login interface parameters
 */
export interface LoginParams {
    email: string;
    password: string;
    remember: boolean;
}

export interface RoleInfo {
    roleName: string;
    value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
    userId: string | number;
    token: string;
    role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
