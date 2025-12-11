import { redirect } from "next/navigation"
import { getSession } from "../lib/session"
import Button from "@/app/lib/ui/button"
import TextInput from "@/app/lib/ui/textInput"

async function loginAction(formData: FormData) {
    "use server"
    const password = formData.get("password")
    const session = await getSession()

    const expected = process.env.APP_LOGIN_PASSWORD || "admin"
    if (typeof password === "string" && password === expected) {
        session.authenticated = true
        await session.save()
        redirect("/admin")
    }
    // Invalid password: silently stay on page (could add feedback later)
}

export default async function Page() {
    const session = await getSession()
    if (session.authenticated) {
        redirect("/admin")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    LinkLeopard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Sign in to the admin panel.
                </p>

                <form action={loginAction} className="mt-4 space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Password
                        </label>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        color="blue"
                        type="submit"
                        className="inline-flex w-full justify-center"
                    >
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    )
}
