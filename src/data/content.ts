// Reviews, blog posts and FAQ — edit these arrays to update the site.

/**
 * ============================================================
 *  REVIEWS — edit these arrays to change what shows on the site.
 *  Files live in /public/reviews. To add one, drop the file there
 *  and add a line below. To remove one, delete its line.
 * ============================================================
 */
export interface VideoReview { src: string; poster: string; title: string; length: string }
export const videoReviews: VideoReview[] = [
  { src: "/reviews/video-1.mp4", poster: "/reviews/video-1.jpg", title: "Before & after experience", length: "0:14" },
  { src: "/reviews/video-2.mp4", poster: "/reviews/video-2.jpg", title: "Course review from our very first student", length: "0:43" },
  { src: "/reviews/video-3.mp4", poster: "/reviews/video-3.jpg", title: "Session 10 review from a punctual student", length: "1:00" },
];

export interface ChatReview { src: string; alt: string; width: number; height: number }
export const chatReviews: ChatReview[] = [
  { src: "/reviews/chat-1.jpg", alt: "WhatsApp message from a student who is also a Meta content creator, saying the course was worth far more than ₹1,000", width: 720, height: 1220 },
  { src: "/reviews/chat-2.jpg", alt: "WhatsApp message from a student saying the course is worth every penny and the fee is very affordable", width: 720, height: 1072 },
  { src: "/reviews/chat-3.jpg", alt: "WhatsApp messages from students saying the sessions were extremely valuable and clearly structured", width: 720, height: 893 },
  { src: "/reviews/chat-4.jpg", alt: "WhatsApp message from a student saying the first two sessions were really good and Instagram reels gave her trust to join", width: 720, height: 440 },
  { src: "/reviews/chat-5.jpg", alt: "WhatsApp message from a student saying this is not a normal course and the teaching is easy to understand", width: 720, height: 836 },
  { src: "/reviews/chat-6.jpg", alt: "WhatsApp message from a student saying the sessions are really good, useful and easy to understand", width: 720, height: 622 },
  { src: "/reviews/chat-7.jpg", alt: "WhatsApp message from a student saying she felt satisfied with the sessions", width: 720, height: 408 },
];

/** Short pull quotes, copied word for word from the messages above. */
export const reviewQuotes: { text: string }[] = [
  { text: "this course worth every single penny I have paid" },
  { text: "Even with my experience, I found your training valuable and learned a lot from it." },
  { text: "I saw ur insta reels and it gave me trust to join ur course." },
];

export interface BlogPost { slug: string; title: string; excerpt: string; date: string; body: string[] }
export const posts: BlogPost[] = [
  {
    slug: "how-i-started-with-nothing",
    title: "How I Started With Nothing",
    excerpt: "In October 2023 I came home with nothing. This is how content writing changed that.",
    date: "2024-10-03",
    // Lines starting with "## " render as section headings; every other line is a paragraph.
    body: [
      "Let me start with a picture. It's 1 October 2023, and I'm standing outside my house with a bag of clothes and not a single rupee in my pocket. I had left home five months earlier, and now I was coming back with nothing.",
      "A year later, almost to the day, I got out of an auto with a brand new laptop that I bought with my own money. I stood there and cried.",
      "This is the story of those 365 days, and everything that led up to them.",
      "## I wanted a big life",
      "Ever since I was small, I wanted to build real wealth. I'll be honest, it was never about showing off. Wealth is power to me, and I have a purpose in life that I keep to myself. I knew I'd need that power to reach it.",
      "At 16 I started reading about money, how businesses work and which skills pay. But here's the thing. I still had no idea what I was actually good at.",
      "College didn't help. I was an average student who skipped classes and sat in the library, teaching myself whatever interested me.",
      "Marks never suited me, but self learning did. Honestly, it's the reason I'm here today.",
      "## The video that changed everything",
      "By early 2023 I was really frustrated. People kept telling me I had a nice voice, so I looked into dubbing and voice work. I read a lot of books, so I tried turning them into podcasts. Nothing worked. Nothing.",
      "My whole family follows a Tamil YouTube channel called Saravanan Decodes. It's crime stories, and we had been watching him for around three years. In March 2023 he posted a video saying he was hiring writers. Send in your scripts, he said, and we'll pick four.",
      "I had never done any writing work in my life. But I had no other door open, and I wasn't going to waste this one. I sat down for five straight days and wrote that script like my life depended on it.",
      "Then silence. A whole month of it. He already had over a million subscribers, so I told myself thousands of people must have applied, and I moved on.",
      "In mid April, a WhatsApp message popped up from him. “You are hired, in the top 5.”",
      "It was 4 in the morning, because I wake up early for my 6 o'clock college bus. I stood in the middle of my house and jumped and jumped and jumped. I couldn't hold the excitement in.",
      "He became my very first client. I earned around 1,500 to 2,000 rupees per script.",
      "## The months I don't talk about much",
      "Then things got difficult at home, and in May 2023 I left.",
      "I moved into a PG near my college. The rent was 11,000 rupees, and I had to write four or five scripts just to pay it, while still going to college. I couldn't handle both, so I shifted to a shared room.",
      "I tried offline jobs too. A doctor's clinic hired me for 13,000 rupees a month to run their Instagram. That meant I wrote, shot, edited, designed the carousels and posted, all by myself. I also worked one week at D Mart, but the travel cost money I didn't have, so I stopped. I never got that salary.",
      "Then money got even tighter, and the problems with my roommates started. There were days I had no proper food. The nights were freezing, and I had no proper bedsheet or warm clothes.",
      "My mind wasn't okay either. I kept asking myself, why did I leave home? Did I just make the worst decision of my life?",
      "My Instagram writing wasn't good enough yet, either. The clinic wasn't getting results, so they moved to an agency. I had also dropped out of college by then.",
      "Those five or six months felt like hell, and I'm not exaggerating. On 1 October, I walked back home with my bag of clothes, and they let me in. That month, I made a proper decision about what I was going to do with my life.",
      "## Three months, one plan",
      "I had October, November and December before 2024 started. No college, no work, no income. Nothing left to lose. So I made a plan.",
      "Every morning I woke up at 4. Black coffee first. Then I wrote down my goals and my to-do list, read them once, did a short workout, and went up to the terrace to meditate. I said my affirmations. After that I sat down and learned writing and marketing, only from free sources like YouTube videos and articles.",
      "Saturday, Sunday, it made no difference. From October to February I did this every single day, with no work coming in. Slowly, something became clear in my head. I knew what I was building.",
      "## The comeback",
      "At the end of December I went back to Saravanan sir. I wrote the Arunima train script, and it went live on 1 January 2024. He later made a full video talking about it. It's pinned on my Instagram page, so you can go and watch it.",
      "Starting the year like that felt like the universe telling me, you're on the right path.",
      "In March 2024 I commented on a social media agency's hiring post. No reply. But one of their editors messaged me, and through him I got a content writing internship at Screelx in April.",
      "That was my second breakthrough. I learned Instagram writing there from the founder, Tarun Kumar, a fitness YouTuber. My pay in those months was only a few thousand rupees, but what I learned was worth far more. Within three months I was getting lakhs of views for a client's page.",
      "Then one small internal contest changed things. I wrote a reel called “5 viral hooks that make your content more viral”. It crossed 1 lakh views in a week, and it has gone past 5 lakh now. I shared it on my own page too, and clients started reaching out to me.",
      "## Full circle",
      "By June the agency was going through a rough phase, and I moved on. And in that same month, guess who contacted me again? Saravanan sir. He wanted to start Instagram content and asked me to write for him.",
      "So the first client of my YouTube days became the first client of my Instagram days. Life is strange. His third reel got 3.3 million views in ten days.",
      "From July I went fully freelance, and it grew fast. I earned 14,000 rupees that July, and by the end of the year I was making 1 lakh a month. I also got to work with some very well known creators.",
      "## One year later",
      "On 3 October 2024 I bought my first laptop with my own money and came home in an auto. Exactly one year before, I had stood at the same door with nothing.",
      "Over the last two years, 2024 and 2025, my income has been between 8 and 12 LPA. Today I take on client work and I coach too. More than 200 students have joined my course, and you can see what they say on my Instagram page.",
      "I'm not telling you this so you'll expect the same. Everyone's journey is different, what you earn depends on your effort and consistency, and I can't promise you anything.",
      "But I can tell you this much. I started with nothing. What changed my life was learning every single day, even when nobody was paying me, and never stopping the process.",
      "Next time, I'll tell you what content writing really is.",
    ],
  },
];

export const faqs = [
  { q: "What language is the course in?", a: "The whole course is taught in Tamil. You learn content writing skills you can use for any audience." },
  { q: "Who is this course for?", a: "Beginners, students from smaller cities, homemakers and working professionals who want a side skill. No degree, big laptop or perfect English needed." },
  { q: "How does access work?", a: "All 10 sessions are recorded. After payment you log in to the student portal and watch at your own pace. Recorded sessions stay available after purchase." },
  { q: "What is the difference between Basic and Pro?", a: "Basic is self study with a light assignment review. Pro adds a personal, detailed review, weekly Sunday doubt sessions (Sundays, 11am to 12pm, on Google Meet), hands on support and the WhatsApp group." },
  { q: "Do I get a certificate?", a: "Yes. Your certificate unlocks once you have watched all sessions and submitted all assignments." },
  { q: "How do assignments work?", a: "You upload assignments on the site. Aishwarya reviews them in sessions 5, 8 and 9." },
  { q: "When are the doubt sessions?", a: "Pro students join a live doubt clearing session every Sunday from 11am to 12pm on Google Meet." },
  { q: "Can I get a refund?", a: "No. All sales are final and there are no refunds. Please read the plan details before paying." },
  { q: "How do I pay?", a: "One time payment in INR via Razorpay: UPI, cards, net banking and wallets." },
];

export const timeline = [
  { when: "Oct 2023", what: "Came home with nothing" },
  { when: "First client", what: "Saravanan Decodes" },
  { when: "Internship", what: "Instagram writing internship" },
  { when: "July 2024", what: "Went freelance" },
  { when: "3 Oct 2024", what: "Bought my first laptop" },
];
