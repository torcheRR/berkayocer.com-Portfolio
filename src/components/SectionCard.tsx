type Props = {
	title: string;
	description: string;
	icon?: string;
	children?: React.ReactNode;
};

export default function SectionCard({ title, description, icon, children }: Props) {
	return (
		<section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-lg cursor-default">
			<header className="flex items-start gap-4">
				<div className="text-3xl h-20 w-20 rounded-xl bg-yellow-500/10 border border-yellow-500/30 grid place-items-center text-yellow-400">
					{icon ?? "★"}
				</div>
				<div>
					<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
					<p className="text-sm text-white/60 mt-1 max-w-prose">{description}</p>
				</div>
			</header>
			{children ? <div className="mt-6">{children}</div> : null}
		</section>
	);
}
