import Sidebar from "@/components/Sidebar";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
	return (
		<div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 sm:gap-6 lg:gap-8">
			<div className="hidden lg:block">
				<Sidebar />
			</div>
			<main className="flex flex-col gap-6 min-w-0">
				<ContactSection />
			</main>
		</div>
	);
}
