import { redirect } from "next/navigation"
import { getSession } from "../lib/session"

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
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}
