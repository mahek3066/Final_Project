// JavaScript source code
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
const noticeData = {
    1: {
        title: "Admission Open for 2025-26",
        description: "Admissions are now open for Undergraduate and Postgraduate courses. Interested students are advised to apply before the deadline. Visit the admission office or official website for eligibility criteria."
    },
    2: {
        title: "Semester Exam Schedule Released",
        description: "The semester examination schedule has been published. Students should check the exam dates carefully and prepare accordingly."
    },
    3: {
        title: "New Workshops Coming Soon",
        description: "The college is organizing technical and soft skill workshops for students to enhance industry readiness."
    },
    4: {
        title: "Library Timings Updated",
        description: "Library timings have been revised. New timings are 9:00 AM to 7:00 PM on working days."
    },
    5: {
        title: "Student Council Elections 2026",
        description: "Student Council elections will be held next month. Eligible students can submit nominations."
    },
    6: {
        title: "Internship Opportunities for BCA Students",
        description: "Multiple internship opportunities are available for BCA students in reputed IT companies."
    },
    7: {
        title: "Guest Lecture on AI & Machine Learning",
        description: "A guest lecture by industry experts on AI & ML will be conducted in the seminar hall."
    },
    8: {
        title: "Sports Day Announcement",
        description: "Annual Sports Day will be organized soon. Students are encouraged to participate."
    },
    9: {
        title: "Scholarship Applications Open",
        description: "Scholarship forms are now available for eligible students. Apply before the last date."
    },
    10: {
        title: "Annual Tech Fest Registration",
        description: "Registrations for the Annual Tech Fest are open. Participate and showcase your talent."
    }
};

app.get('/notice-details', (req, res) => {
    const id = req.query.id;
    const notice = noticeData[id];

    if (!notice) {
        return res.send("Notice not found");
    }

    res.render('notice', { notice });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});