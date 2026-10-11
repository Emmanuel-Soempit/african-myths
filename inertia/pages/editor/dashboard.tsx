import EditorDashboardLayout from "~/editor/layout/editor-dashboard";
import { ReactNode } from "react";

export default function EditorDashboard() {
    return (
        <div className="space-y-10">
            {/* CULTURE OVERVIEW SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feature Card */}
                <div className="lg:col-span-2 relative h-[400px] rounded-xl overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#19120c] via-transparent to-transparent z-10"></div>
                    <img
                        alt="Yoruba Culture Heritage"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAazBiyCHC6maR6Bp-3XzQfPWsA0p0cxh6g06Xqu8eOODpNJdX8cDlhCRar6CkaIkAtc9AtgbbvyakttZktSDzkiLJGZpeL9miCyBaEsKhJCaCgAvpVneHwvSFV-RAI36m8uEAWcJhnbqapVpOt1_lQL0Qg5Ew4RDTNjE8INBkFPAJLv95D5LvgS017SaTgx1DGnDr84_JsznwZC7PJHssl3QK0Sc1c2kFc3ysTt1RHc9WYb8EDdF9iwVB1laV9zdTAH1b2us8ShlU"
                    />
                    <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="bg-primary/20 text-primary text-label-sm font-bold px-3 py-1 rounded-full border border-primary/30 mb-4 inline-block">
                                    ETHNICITY FEATURE
                                </span>
                                <h3 className="font-display-lg text-display-lg text-white mb-2">Yoruba Culture</h3>
                                <p className="text-secondary max-w-xl">
                                    Deeply rooted in West Africa, the Yoruba culture is a vibrant tapestry of intricate artistry, complex cosmology, and enduring traditions that span across Nigeria, Benin, and the diaspora.
                                </p>
                            </div>
                            <div className="flex gap-4 mb-2">
                                <button className="px-6 py-3 bg-primary-container text-on-primary font-bold rounded-lg flex items-center gap-2 hover:bg-primary transition-all active:scale-95">
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                    <span>Edit Culture Info</span>
                                </button>
                                <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                                    <span>View Culture Info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Side Panel */}
                <div className="space-y-6">
                    <div className="bg-surface-dark border border-border-dark p-6 rounded-xl hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                            </div>
                            <span className="text-secondary text-label-sm font-bold">LIFETIME STATS</span>
                        </div>
                        <h4 className="text-secondary text-label-md mb-1">Total Myths Recorded</h4>
                        <p className="font-display-lg text-display-lg text-white">152</p>
                        <div className="mt-4 pt-4 border-t border-border-dark flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span className="text-label-sm font-bold">+12% from last month</span>
                        </div>
                    </div>
                    <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-secondary text-label-sm mb-1 uppercase tracking-tighter">Published</h4>
                                <p className="font-headline-md text-headline-md text-primary">120</p>
                                <div className="w-full h-1.5 bg-border-dark rounded-full mt-3">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-secondary text-label-sm mb-1 uppercase tracking-tighter">Drafts</h4>
                                <p className="font-headline-md text-headline-md text-secondary">32</p>
                                <div className="w-full h-1.5 bg-border-dark rounded-full mt-3">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: "22%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ASYMMETRIC GRID: RECENT ACTIONS & REVIEWS */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* RECENTLY EDITED MYTHS (Bento Card Large) */}
                <div className="md:col-span-8 bg-surface-dark border border-border-dark rounded-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-headline-md text-headline-md text-primary">Recently Edited Myths</h3>
                        <a className="text-primary text-label-md hover:underline" href="#">
                            View All Archive
                        </a>
                    </div>
                    <div className="space-y-4">
                        {/* Table Head */}
                        <div className="grid grid-cols-12 px-4 py-2 text-secondary text-label-sm uppercase tracking-wider">
                            <div className="col-span-6">Myth Title</div>
                            <div className="col-span-3">Last Edit</div>
                            <div className="col-span-3 text-right">Status</div>
                        </div>
                        {/* Myth Rows */}
                        <div className="grid grid-cols-12 items-center px-4 py-4 bg-white/5 border border-transparent hover:border-primary/30 rounded-lg transition-all cursor-pointer group">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    01
                                </div>
                                <div>
                                    <p className="text-on-surface font-bold">The Creation of Earth by Oduduwa</p>
                                    <p className="text-secondary text-label-sm">Primary Cosmology Series</p>
                                </div>
                            </div>
                            <div className="col-span-3 text-secondary text-label-md">2h ago by You</div>
                            <div className="col-span-3 text-right">
                                <span className="bg-primary/20 text-primary text-label-sm px-3 py-1 rounded-full border border-primary/20">
                                    Published
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 items-center px-4 py-4 bg-white/5 border border-transparent hover:border-primary/30 rounded-lg transition-all cursor-pointer">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                                    02
                                </div>
                                <div>
                                    <p className="text-on-surface font-bold">Shango's Ascension: The Fire Within</p>
                                    <p className="text-secondary text-label-sm">Orisha Chronicles</p>
                                </div>
                            </div>
                            <div className="col-span-3 text-secondary text-label-md">Yesterday</div>
                            <div className="col-span-3 text-right">
                                <span className="bg-secondary/20 text-secondary text-label-sm px-3 py-1 rounded-full border border-secondary/20">
                                    Draft
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 items-center px-4 py-4 bg-white/5 border border-transparent hover:border-primary/30 rounded-lg transition-all cursor-pointer">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    03
                                </div>
                                <div>
                                    <p className="text-on-surface font-bold">The Twin Cult: Ibeji Legacy</p>
                                    <p className="text-secondary text-label-sm">Social Traditions</p>
                                </div>
                            </div>
                            <div className="col-span-3 text-secondary text-label-md">3 days ago</div>
                            <div className="col-span-3 text-right">
                                <span className="bg-primary/20 text-primary text-label-sm px-3 py-1 rounded-full border border-primary/20">
                                    Published
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EDITORIAL GUIDELINES (Bento Card Small) */}
                <div className="md:col-span-4 bg-primary-container/10 border border-primary/20 rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
                    <span className="material-symbols-outlined absolute -right-4 -top-4 text-primary/10 text-[120px]">
                        menu_book
                    </span>
                    <div>
                        <h3 className="font-headline-md text-headline-md text-primary mb-4 relative z-10">Editor Notes</h3>
                        <p className="text-on-surface mb-6 relative z-10 leading-relaxed italic">
                            "Ensure all Yoruba terminology is properly accented. We are currently focusing on expanding the 'Ancestral Lineages' section for the upcoming quarter."
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                <span className="text-label-md">Verify sources for 'Oyo Empire' expansion.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                <span className="text-label-md">Update tone of voice for Orisha myths.</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-10 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all relative z-10">
                        Open Knowledge Base
                    </button>
                </div>
            </section>
        </div>
    );
}

EditorDashboard.layout = (page: ReactNode) => {
    return <EditorDashboardLayout title="Editor Dashboard">{page}</EditorDashboardLayout>;
};
