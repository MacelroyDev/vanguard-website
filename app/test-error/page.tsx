'use client'

export default function TestError() {
    // This will throw an error when the button is clicked
    const handleError = () => {
        throw new Error('Test error - The Pulverizer has malfunctioned again!')
    }

    return (
        <div className="bg-zinc-900 min-h-screen flex items-center justify-center">
            <button
                onClick={handleError}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold uppercase"
            >
                Trigger Test Error
            </button>
        </div>
    )
}