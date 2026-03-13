import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

export const Route = createFileRoute("/food")({
	component: FoodPage,
})

function FoodPage() {
	return (
		<div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center space-y-4 mb-12">
					<h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
						Food Management
					</h1>
					<p className="text-gray-600 text-lg">
						Track and manage your favorite foods
					</p>
				</div>

				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl text-gray-900">
							Coming Soon
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700 leading-relaxed">
							Food management features are currently under development.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
