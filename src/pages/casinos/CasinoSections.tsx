import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

const restaurants = [];
const promotions = [];
const hotels = [];
const casinoData = {};

const CasinoSections = () => {
	const { casinoId } = useParams();
	// In a real app, fetch casino name by casinoId
	const casinoName = "";

	const [activeTab, setActiveTab] = useState<string>(""); // No tab active by default

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex flex-wrap items-center gap-2 md:gap-4">
					<Link to="/adminpanel/casinos" className="text-gray-500 hover:text-gray-700">
						<ArrowLeft className="w-5 h-5" />
					</Link>
					{/* Casino image and name */}
					<img
						src={casinoData.image}
						alt={casinoName}
						className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm mr-0"
					/>
					<span className="text-2xl font-bold text-navy-500 mr-2">{casinoName}</span>
					<Button
						variant={activeTab === "restaurants" ? "default" : "outline"}
						className="rounded-full px-4 py-1 text-sm"
						onClick={() => setActiveTab("restaurants")}
					>
						Restaurants
					</Button>
					<Button
						variant={activeTab === "promotions" ? "default" : "outline"}
						className="rounded-full px-4 py-1 text-sm"
						onClick={() => setActiveTab("promotions")}
					>
						Promotions
					</Button>
					<Button
						variant={activeTab === "hotels" ? "default" : "outline"}
						className="rounded-full px-4 py-1 text-sm"
						onClick={() => setActiveTab("hotels")}
					>
						Hotels
					</Button>
					<div className="flex-1" />
					<Link to={`/adminpanel/casinos/${casinoId}/edit`}>
						<Button className="bg-navy-500 hover:bg-navy-600 text-white ml-2">
							<Edit className="w-4 h-4 mr-2" />
							Edit Casino
						</Button>
					</Link>
				</div>
			</header>
			<main className="p-6 space-y-6">
				{/* Casino Information and Location always visible */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Casino Information Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-navy-600">Casino Information</CardTitle>
							<CardDescription>Details about the casino</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="font-medium">Status:</span>
								<Badge
									variant={casinoData.status === "Active" ? "default" : "secondary"}
									className={casinoData.status === "Active" ? "bg-casino-green text-white" : ""}
								>
									{casinoData.status}
								</Badge>
							</div>
							<div>
								<span className="font-medium">Description:</span>
								<p className="text-gray-600 mt-1">{casinoData.description}</p>
							</div>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
										<path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" />
										<circle cx="12" cy="11" r="3" />
									</svg>
									<span className="text-gray-600">{casinoData.address}</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
										<path d="M4 4h16v16H4z" />
									</svg>
									<span className="text-gray-600">{casinoData.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
										<path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 21 16.91z" />
									</svg>
									<span className="text-gray-600">{casinoData.phone}</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
									<span className="text-gray-600">{casinoData.timings}</span>
								</div>
							</div>
							<div>
								<span className="font-medium">Subcategories:</span>
								<div className="flex flex-wrap gap-2 mt-1">
									{casinoData.subcategories?.map((sub, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{sub}
										</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
					{/* Location Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-navy-600">Location</CardTitle>
							<CardDescription>Casino location on map</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="w-full h-56 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 mb-4">
								<span className="text-gray-400">Map Placeholder</span>
							</div>
							<div className="flex justify-between text-sm">
								<div>
									<span className="font-medium">Latitude:</span>
									<p className="text-gray-600">{casinoData.latitude}</p>
								</div>
								<div>
									<span className="font-medium">Longitude:</span>
									<p className="text-gray-600">{casinoData.longitude}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				{/* Section content below info/location, only one visible at a time */}
				{activeTab === "restaurants" && (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-navy-600">Restaurants</CardTitle>
								<CardDescription>Dining establishments within the casino</CardDescription>
							</div>
							<Button className="bg-maroon-500 hover:bg-maroon-600 text-white">
								<Plus className="w-4 h-4 mr-2" />
								Add Restaurant
							</Button>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Cuisine</TableHead>
										<TableHead>Rating</TableHead>
										<TableHead className="w-20">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{restaurants.map((restaurant) => (
										<TableRow key={restaurant.id}>
											<TableCell className="font-medium">{restaurant.name}</TableCell>
											<TableCell>{restaurant.cuisine}</TableCell>
											<TableCell>
												<Badge variant="secondary" className="bg-casino-gold/10 text-casino-gold">
													★ {restaurant.rating}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<Edit className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
				{activeTab === "promotions" && (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-navy-600">Promotions</CardTitle>
								<CardDescription>Casino promotions and special offers</CardDescription>
							</div>
							<Button className="bg-casino-green hover:bg-casino-green/90 text-white">
								<Plus className="w-4 h-4 mr-2" />
								Add Promotion
							</Button>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="w-20">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{promotions.map((promotion) => (
										<TableRow key={promotion.id}>
											<TableCell className="font-medium">{promotion.title}</TableCell>
											<TableCell>{promotion.description}</TableCell>
											<TableCell>
												<Badge
													variant={promotion.status === "Active" ? "default" : "secondary"}
													className={promotion.status === "Active" ? "bg-casino-green text-white" : ""}
												>
													{promotion.status}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<Edit className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
				{activeTab === "hotels" && (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-navy-600">Hotels</CardTitle>
								<CardDescription>Hotel accommodations within the casino complex</CardDescription>
							</div>
							<Button className="bg-casino-gold hover:bg-casino-gold/90 text-white">
								<Plus className="w-4 h-4 mr-2" />
								Add Hotel
							</Button>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Rooms</TableHead>
										<TableHead>Rating</TableHead>
										<TableHead className="w-20">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{hotels.map((hotel) => (
										<TableRow key={hotel.id}>
											<TableCell className="font-medium">{hotel.name}</TableCell>
											<TableCell>{hotel.rooms} rooms</TableCell>
											<TableCell>
												<Badge variant="secondary" className="bg-casino-gold/10 text-casino-gold">
													★ {hotel.rating}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<Edit className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
			</main>
		</div>
	);
};

export default CasinoSections;
