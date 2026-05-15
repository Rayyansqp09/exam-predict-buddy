export type SubjectProduct = {
    id: string;
    name: string;
    description: string;
    price: number;
};

export type SemesterProductGroup = {
    course: string;
    semester: number;
    subjects: SubjectProduct[];
};

export const PURCHASE_DATA: SemesterProductGroup[] = [
    {
        course: "VCS",
        semester: 1,
        subjects: [
            {
                id: "vcs-sem1-sub1",
                name: "Subject 1 Name",
                description: "Short description of this paper.",
                price: 30,
            },
            {
                id: "vcs-sem1-sub2",
                name: "Subject 2 Name",
                description: "Short description of this paper.",
                price: 30,
            },
        ],
    },
    {
        course: "BCA",
        semester: 1,
        subjects: [
            {
                id: "bca-sem1-sub1",
                name: "Programming Fundamentals",
                description: "Core paper with expected repeated concepts.",
                price: 30,
                pdfUrl: "/pdfs/ConfirmationPage-265610083999.pdf",
            },
            {
                id: "bca-sem1-sub2",
                name: "Mathematics for Computing",
                description: "Important numericals and theory-based questions.",
                price: 30,
            },
        ],
    },
];

export function getPurchaseGroup(course: string, semester: number) {
    return PURCHASE_DATA.find(
        (item) => item.course === course && item.semester === semester,
    );
}