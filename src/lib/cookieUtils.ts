"use server";

import { cookies } from "next/headers";
import { getAuthCookieOptions } from "./tokenUtils";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    const cookieStore = await cookies();
    const options = getAuthCookieOptions();

    cookieStore.set(name, value, {
        ...options,
        maxAge : maxAgeInSeconds,
    })
}

export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}