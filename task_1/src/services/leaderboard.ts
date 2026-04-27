import type { User } from '../types'

const monthToNumber: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
}

function parseActivityDate(date: string): { year: number; month: number } {
  const parts = date.split('-')
  return { year: parseInt(parts[2]!, 10), month: monthToNumber[parts[1]!] ?? 1 }
}

function getQuarter(month: number): number {
  return Math.ceil(month / 3)
}

function totalScore(user: User): number {
  return user.activities.reduce((sum, a) => sum + a.points, 0)
}

const users: User[] = [
  {
    id: 1,
    name: 'Andrei Kuzmich',
    title: 'Senior Software Engineer',
    unit: 'EQ.U1.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10001.jpg',
    activities: [
      { title: '[LAB] Mentoring of Nikita Volkov', category: 'Education', date: '15-Mar-2026', points: 72 },
      { title: '[REG] React Meetup Presentation', category: 'Public Speaking', date: '10-Jan-2026', points: 88 },
      { title: '[LAB] Curating frontend lab sessions', category: 'Education', date: '20-Nov-2025', points: 55 },
      { title: '[UNI] Academic internship mentoring', category: 'University Partnership', date: '05-Sep-2025', points: 40 },
      { title: '[REG] Internal tech talk on TypeScript', category: 'Public Speaking', date: '17-Jul-2025', points: 65 },
      { title: '[LAB] Mentoring of Daria Petrova', category: 'Education', date: '02-May-2025', points: 48 },
    ],
  },
  {
    id: 2,
    name: 'Volha Stankevich',
    title: 'QA Engineer',
    unit: 'BG3.U2.G3.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10002.jpg',
    activities: [
      { title: '[LAB] Mentoring of Pavel Kozlov', category: 'Education', date: '12-Feb-2026', points: 60 },
      { title: '[UNI] University guest lecture on QA', category: 'University Partnership', date: '01-Dec-2025', points: 35 },
      { title: '[REG] QA Summit regional talk', category: 'Public Speaking', date: '15-Oct-2025', points: 92 },
      { title: '[LAB] Lecturing on test automation', category: 'Education', date: '22-Aug-2025', points: 44 },
    ],
  },
  {
    id: 3,
    name: 'Maksim Drazdou',
    title: 'Group Manager',
    unit: 'EQ.U1.G2.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10003.jpg',
    activities: [
      { title: '[REG] Leadership conference keynote', category: 'Public Speaking', date: '20-Mar-2026', points: 95 },
      { title: '[LAB] Mentoring of Alina Kovalenko', category: 'Education', date: '14-Jan-2026', points: 58 },
      { title: '[UNI] University career fair participation', category: 'University Partnership', date: '08-Nov-2025', points: 30 },
      { title: '[LAB] Curating management workshop', category: 'Education', date: '19-Jun-2025', points: 67 },
      { title: '[REG] Internal training on Agile', category: 'Public Speaking', date: '03-Apr-2025', points: 73 },
    ],
  },
  {
    id: 4,
    name: 'Katsiaryna Novik',
    title: 'Software Engineer',
    unit: 'BG3.U1.G1.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10004.jpg',
    activities: [
      { title: '[LAB] Mentoring of Ivan Sokolov', category: 'Education', date: '22-Feb-2026', points: 51 },
      { title: '[UNI] Academic practice supervision', category: 'University Partnership', date: '10-Dec-2025', points: 28 },
      { title: '[REG] Frontend meetup talk', category: 'Public Speaking', date: '05-Oct-2025', points: 80 },
    ],
  },
  {
    id: 5,
    name: 'Dzmitry Halavach',
    title: 'Senior QA Engineer',
    unit: 'EQ.U2.G1.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10005.jpg',
    activities: [
      { title: '[LAB] Mentoring of Marta Lebedeva', category: 'Education', date: '18-Mar-2026', points: 63 },
      { title: '[LAB] Lecturing on performance testing', category: 'Education', date: '25-Jan-2026', points: 47 },
      { title: '[UNI] University workshop on testing', category: 'University Partnership', date: '30-Nov-2025', points: 38 },
      { title: '[REG] Regional QA conference talk', category: 'Public Speaking', date: '14-Aug-2025', points: 91 },
      { title: '[LAB] Curating automation lab', category: 'Education', date: '06-May-2025', points: 55 },
      { title: '[UNI] Guest lecture at technical university', category: 'University Partnership', date: '20-Feb-2025', points: 33 },
    ],
  },
  {
    id: 6,
    name: 'Alena Radzivonava',
    title: 'Software Engineer',
    unit: 'BG3.U1.G2.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10006.jpg',
    activities: [
      { title: '[REG] Cloud Native talk at meetup', category: 'Public Speaking', date: '28-Feb-2026', points: 85 },
      { title: '[LAB] Mentoring of Elena Popova', category: 'Education', date: '15-Dec-2025', points: 52 },
      { title: '[LAB] Curating backend workshop', category: 'Education', date: '09-Sep-2025', points: 61 },
    ],
  },
  {
    id: 7,
    name: 'Siarhei Baranouski',
    title: 'Lead Software Engineer',
    unit: 'EQ.U1.G3.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10007.jpg',
    activities: [
      { title: '[LAB] Mentoring of Svetlana Morozova', category: 'Education', date: '10-Mar-2026', points: 70 },
      { title: '[UNI] Academic internship mentoring', category: 'University Partnership', date: '22-Jan-2026', points: 42 },
      { title: '[REG] Architecture talk at local meetup', category: 'Public Speaking', date: '18-Oct-2025', points: 77 },
      { title: '[LAB] Lecturing on microservices', category: 'Education', date: '05-Jul-2025', points: 59 },
      { title: '[REG] Internal training on CI/CD', category: 'Public Speaking', date: '12-Apr-2025', points: 68 },
      { title: '[UNI] University partnership program lead', category: 'University Partnership', date: '28-Jan-2025', points: 36 },
      { title: '[LAB] Curating code review sessions', category: 'Education', date: '15-Mar-2025', points: 45 },
    ],
  },
  {
    id: 8,
    name: 'Iryna Kazlova',
    title: 'QA Engineer',
    unit: 'BG3.U2.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10008.jpg',
    activities: [
      { title: '[LAB] Mentoring of Yulia Kuznetsova', category: 'Education', date: '05-Mar-2026', points: 54 },
      { title: '[REG] Testing conference presentation', category: 'Public Speaking', date: '18-Dec-2025', points: 89 },
      { title: '[UNI] Guest lecture on test strategies', category: 'University Partnership', date: '04-Sep-2025', points: 31 },
    ],
  },
  {
    id: 9,
    name: 'Viktar Zhukouski',
    title: 'Software Engineer',
    unit: 'EQ.U1.G1.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10009.jpg',
    activities: [
      { title: '[UNI] University guest lecture on APIs', category: 'University Partnership', date: '01-Mar-2026', points: 29 },
      { title: '[LAB] Mentoring of Anna Sidorova', category: 'Education', date: '14-Feb-2026', points: 66 },
      { title: '[REG] Regional DevOps meetup talk', category: 'Public Speaking', date: '20-Oct-2025', points: 82 },
      { title: '[LAB] Curating Docker workshop', category: 'Education', date: '11-Jul-2025', points: 50 },
    ],
  },
  {
    id: 10,
    name: 'Maryia Filipava',
    title: 'Senior Software Engineer',
    unit: 'BG3.U1.G3.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10010.jpg',
    activities: [
      { title: '[REG] DevOps meetup talk', category: 'Public Speaking', date: '25-Feb-2026', points: 93 },
      { title: '[LAB] Mentoring of Mikhail Orlov', category: 'Education', date: '20-Dec-2025', points: 57 },
      { title: '[UNI] Academic practice curator', category: 'University Partnership', date: '08-Aug-2025', points: 34 },
      { title: '[LAB] Lecturing on system design', category: 'Education', date: '15-May-2025', points: 62 },
      { title: '[REG] Internal talk on observability', category: 'Public Speaking', date: '22-Feb-2025', points: 76 },
    ],
  },
  {
    id: 11,
    name: 'Pavel Karneyeu',
    title: 'Group Manager',
    unit: 'EQ.U2.G2.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10011.jpg',
    activities: [
      { title: '[LAB] Mentoring of Tatsiana Ivanova', category: 'Education', date: '12-Mar-2026', points: 49 },
      { title: '[UNI] University partnership program', category: 'University Partnership', date: '05-Jan-2026', points: 37 },
      { title: '[REG] Management summit presentation', category: 'Public Speaking', date: '16-Sep-2025', points: 84 },
    ],
  },
  {
    id: 12,
    name: 'Natallia Shuba',
    title: 'Lead QA Engineer',
    unit: 'BG3.U2.G2.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10012.jpg',
    activities: [
      { title: '[LAB] Mentoring of Alexei Fedorov', category: 'Education', date: '08-Mar-2026', points: 71 },
      { title: '[REG] Architecture summit talk', category: 'Public Speaking', date: '15-Jan-2026', points: 87 },
      { title: '[UNI] Guest lecture on quality assurance', category: 'University Partnership', date: '02-Nov-2025', points: 39 },
      { title: '[LAB] Curating exploratory testing lab', category: 'Education', date: '18-Jul-2025', points: 53 },
      { title: '[REG] Internal training on risk-based testing', category: 'Public Speaking', date: '25-Apr-2025', points: 74 },
      { title: '[LAB] Lecturing on API testing', category: 'Education', date: '10-Feb-2025', points: 46 },
    ],
  },
  {
    id: 13,
    name: 'Artsiom Marozau',
    title: 'Software Engineer',
    unit: 'EQ.U1.G2.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10013.jpg',
    activities: [
      { title: '[UNI] Design workshop at university', category: 'University Partnership', date: '20-Feb-2026', points: 27 },
      { title: '[LAB] Mentoring of Kristina Petrova', category: 'Education', date: '10-Jan-2026', points: 64 },
      { title: '[REG] JavaScript meetup talk', category: 'Public Speaking', date: '28-Sep-2025', points: 79 },
    ],
  },
  {
    id: 14,
    name: 'Hanna Yakimovich',
    title: 'Senior QA Engineer',
    unit: 'BG3.U1.G1.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10014.jpg',
    activities: [
      { title: '[LAB] Mentoring of Viktor Soloviev', category: 'Education', date: '28-Feb-2026', points: 58 },
      { title: '[UNI] Academic internship supervision', category: 'University Partnership', date: '12-Dec-2025', points: 41 },
      { title: '[REG] QA automation conference talk', category: 'Public Speaking', date: '06-Aug-2025', points: 90 },
      { title: '[LAB] Curating regression testing workshop', category: 'Education', date: '22-May-2025', points: 43 },
    ],
  },
  {
    id: 15,
    name: 'Uladzislau Karpovich',
    title: 'Software Engineer',
    unit: 'EQ.U1.G3.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10015.jpg',
    activities: [
      { title: '[LAB] Mentoring of Valeryia Dziatsel', category: 'Education', date: '20-Nov-2025', points: 56 },
      { title: '[UNI] Academic internship mentoring', category: 'University Partnership', date: '17-Jul-2025', points: 32 },
      { title: '[LAB] Mentoring of Lizaveta Yurashevich', category: 'Education', date: '10-May-2025', points: 69 },
      { title: '[REG] Internal talk on Go best practices', category: 'Public Speaking', date: '09-Apr-2025', points: 78 },
      { title: '[LAB] Curating Kubernetes lab', category: 'Education', date: '15-Feb-2025', points: 44 },
    ],
  },
  {
    id: 16,
    name: 'Darya Semenava',
    title: 'QA Engineer',
    unit: 'BG3.U2.G3.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10016.jpg',
    activities: [
      { title: '[REG] Mobile testing conference talk', category: 'Public Speaking', date: '04-Apr-2026', points: 86 },
      { title: '[LAB] Mentoring of Artem Belov', category: 'Education', date: '18-Feb-2026', points: 53 },
      { title: '[UNI] University workshop on mobile QA', category: 'University Partnership', date: '25-Oct-2025', points: 30 },
      { title: '[LAB] Lecturing on Appium framework', category: 'Education', date: '12-Jun-2025', points: 61 },
      { title: '[REG] Internal training on visual testing', category: 'Public Speaking', date: '08-Mar-2025', points: 72 },
    ],
  },
  {
    id: 17,
    name: 'Yahor Pratasevich',
    title: 'Lead Software Engineer',
    unit: 'EQ.U2.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10017.jpg',
    activities: [
      { title: '[LAB] Mentoring of Olga Smirnova', category: 'Education', date: '15-Apr-2026', points: 68 },
      { title: '[REG] DevConf keynote speaker', category: 'Public Speaking', date: '22-Feb-2026', points: 97 },
      { title: '[UNI] Guest lecture on distributed systems', category: 'University Partnership', date: '14-Nov-2025', points: 35 },
      { title: '[LAB] Curating Java advanced lab', category: 'Education', date: '30-Aug-2025', points: 59 },
      { title: '[REG] Internal training on DDD', category: 'Public Speaking', date: '16-May-2025', points: 81 },
      { title: '[UNI] Academic practice curator', category: 'University Partnership', date: '03-Mar-2025', points: 26 },
      { title: '[LAB] Mentoring of Denis Kovalchuk', category: 'Education', date: '18-Jan-2025', points: 52 },
      { title: '[REG] Regional architecture meetup', category: 'Public Speaking', date: '05-Feb-2025', points: 74 },
    ],
  },
  {
    id: 18,
    name: 'Lizaveta Hrynkevich',
    title: 'Software Engineer',
    unit: 'BG3.U1.G2.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10018.jpg',
    activities: [
      { title: '[LAB] Mentoring of Andrei Novak', category: 'Education', date: '02-Mar-2026', points: 50 },
      { title: '[UNI] University career day speaker', category: 'University Partnership', date: '19-Dec-2025', points: 33 },
      { title: '[REG] Vue.js meetup presentation', category: 'Public Speaking', date: '07-Sep-2025', points: 83 },
    ],
  },
  {
    id: 19,
    name: 'Raman Bychkou',
    title: 'Senior Software Engineer',
    unit: 'EQ.U1.G1.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10019.jpg',
    activities: [
      { title: '[REG] Backend conference talk', category: 'Public Speaking', date: '11-Apr-2026', points: 94 },
      { title: '[LAB] Mentoring of Nadia Klimova', category: 'Education', date: '26-Jan-2026', points: 62 },
      { title: '[LAB] Curating Python workshop', category: 'Education', date: '13-Oct-2025', points: 48 },
      { title: '[UNI] Guest lecturer at BSU', category: 'University Partnership', date: '29-Jun-2025', points: 37 },
      { title: '[REG] Internal talk on clean architecture', category: 'Public Speaking', date: '14-Apr-2025', points: 71 },
      { title: '[LAB] Mentoring of Roman Kravchenko', category: 'Education', date: '01-Feb-2025', points: 56 },
    ],
  },
  {
    id: 20,
    name: 'Veranika Zaleskaya',
    title: 'QA Engineer',
    unit: 'BG3.U2.G1.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10020.jpg',
    activities: [
      { title: '[LAB] Mentoring of Dmitry Petrov', category: 'Education', date: '06-Mar-2026', points: 57 },
      { title: '[REG] Security testing meetup talk', category: 'Public Speaking', date: '21-Jan-2026', points: 85 },
      { title: '[UNI] University internship supervision', category: 'University Partnership', date: '09-Oct-2025', points: 29 },
    ],
  },
  {
    id: 21,
    name: 'Ihar Bahdanovich',
    title: 'Group Manager',
    unit: 'EQ.U2.G3.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10021.jpg',
    activities: [
      { title: '[REG] Engineering leadership summit', category: 'Public Speaking', date: '17-Mar-2026', points: 98 },
      { title: '[LAB] Mentoring of Alina Kovalenko', category: 'Education', date: '03-Feb-2026', points: 45 },
      { title: '[UNI] University partnership coordination', category: 'University Partnership', date: '20-Nov-2025', points: 38 },
      { title: '[LAB] Curating leadership workshop', category: 'Education', date: '07-Aug-2025', points: 54 },
      { title: '[REG] Internal training on team management', category: 'Public Speaking', date: '24-May-2025', points: 69 },
    ],
  },
  {
    id: 22,
    name: 'Tatsiana Kavalchuk',
    title: 'Senior QA Engineer',
    unit: 'BG3.U1.G3.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10022.jpg',
    activities: [
      { title: '[LAB] Mentoring of Igor Vasiliev', category: 'Education', date: '09-Apr-2026', points: 65 },
      { title: '[UNI] Guest lecture on CI/CD for QA', category: 'University Partnership', date: '27-Feb-2026', points: 36 },
      { title: '[REG] Testing automation conference', category: 'Public Speaking', date: '16-Dec-2025', points: 88 },
      { title: '[LAB] Curating Selenium workshop', category: 'Education', date: '03-Sep-2025', points: 47 },
      { title: '[REG] Internal training on BDD', category: 'Public Speaking', date: '19-Jun-2025', points: 73 },
      { title: '[LAB] Lecturing on test design techniques', category: 'Education', date: '05-Mar-2025', points: 51 },
      { title: '[UNI] Academic internship mentor', category: 'University Partnership', date: '20-Jan-2025', points: 28 },
    ],
  },
  {
    id: 23,
    name: 'Aliaksandr Savitski',
    title: 'Software Engineer',
    unit: 'EQ.U1.G2.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10023.jpg',
    activities: [
      { title: '[LAB] Mentoring of Ekaterina Orlova', category: 'Education', date: '23-Mar-2026', points: 60 },
      { title: '[REG] Rust meetup talk', category: 'Public Speaking', date: '08-Jan-2026', points: 82 },
      { title: '[UNI] University hackathon mentor', category: 'University Partnership', date: '24-Oct-2025', points: 31 },
      { title: '[LAB] Curating Rust beginner lab', category: 'Education', date: '10-Jul-2025', points: 55 },
    ],
  },
  {
    id: 24,
    name: 'Valiantsina Hrushko',
    title: 'Lead Software Engineer',
    unit: 'BG3.U2.G2.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10024.jpg',
    activities: [
      { title: '[REG] Women in Tech conference talk', category: 'Public Speaking', date: '30-Mar-2026', points: 96 },
      { title: '[LAB] Mentoring of Polina Kuzma', category: 'Education', date: '16-Feb-2026', points: 63 },
      { title: '[UNI] Guest lecture on software engineering', category: 'University Partnership', date: '01-Dec-2025', points: 40 },
      { title: '[LAB] Curating web security workshop', category: 'Education', date: '17-Aug-2025', points: 58 },
      { title: '[REG] Internal training on code reviews', category: 'Public Speaking', date: '04-May-2025', points: 75 },
      { title: '[UNI] Academic practice curator', category: 'University Partnership', date: '19-Feb-2025', points: 34 },
    ],
  },
  {
    id: 25,
    name: 'Kiryl Urbanovich',
    title: 'QA Engineer',
    unit: 'EQ.U2.G2.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10025.jpg',
    activities: [
      { title: '[LAB] Mentoring of Sergei Maltsev', category: 'Education', date: '14-Apr-2026', points: 49 },
      { title: '[REG] Performance testing talk', category: 'Public Speaking', date: '02-Feb-2026', points: 81 },
      { title: '[UNI] University lab assistant', category: 'University Partnership', date: '18-Nov-2025', points: 26 },
    ],
  },
  {
    id: 26,
    name: 'Anastasiya Kolas',
    title: 'Senior Software Engineer',
    unit: 'BG3.U1.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10026.jpg',
    activities: [
      { title: '[LAB] Mentoring of Maksim Zhukov', category: 'Education', date: '19-Mar-2026', points: 67 },
      { title: '[REG] GraphQL conference talk', category: 'Public Speaking', date: '05-Feb-2026', points: 91 },
      { title: '[LAB] Curating API design workshop', category: 'Education', date: '23-Nov-2025', points: 53 },
      { title: '[UNI] University open day speaker', category: 'University Partnership', date: '10-Aug-2025', points: 32 },
      { title: '[REG] Internal training on GraphQL', category: 'Public Speaking', date: '27-Apr-2025', points: 70 },
      { title: '[LAB] Lecturing on REST vs GraphQL', category: 'Education', date: '13-Feb-2025', points: 46 },
      { title: '[UNI] Academic internship mentoring', category: 'University Partnership', date: '01-Jan-2025', points: 25 },
    ],
  },
  {
    id: 27,
    name: 'Daniil Tsikhanau',
    title: 'Software Engineer',
    unit: 'EQ.U1.G3.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10027.jpg',
    activities: [
      { title: '[UNI] Guest lecture on databases', category: 'University Partnership', date: '07-Mar-2026', points: 33 },
      { title: '[LAB] Mentoring of Yana Belova', category: 'Education', date: '19-Jan-2026', points: 58 },
      { title: '[REG] PostgreSQL meetup presentation', category: 'Public Speaking', date: '06-Oct-2025', points: 77 },
      { title: '[LAB] Curating SQL optimization lab', category: 'Education', date: '22-Jun-2025', points: 50 },
      { title: '[REG] Internal talk on database indexing', category: 'Public Speaking', date: '09-Mar-2025', points: 66 },
    ],
  },
  {
    id: 28,
    name: 'Yuliya Shymanovich',
    title: 'Group Manager',
    unit: 'BG3.U2.G3.T3',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10028.jpg',
    activities: [
      { title: '[REG] Engineering culture conference', category: 'Public Speaking', date: '21-Mar-2026', points: 100 },
      { title: '[LAB] Mentoring of Nikita Volkov', category: 'Education', date: '08-Feb-2026', points: 55 },
      { title: '[UNI] University advisory board member', category: 'University Partnership', date: '15-Nov-2025', points: 42 },
      { title: '[LAB] Curating new manager onboarding', category: 'Education', date: '02-Aug-2025', points: 60 },
    ],
  },
  {
    id: 29,
    name: 'Mikita Charniauski',
    title: 'Senior QA Engineer',
    unit: 'EQ.U2.G3.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10029.jpg',
    activities: [
      { title: '[LAB] Mentoring of Alla Romanova', category: 'Education', date: '25-Mar-2026', points: 64 },
      { title: '[REG] Contract testing regional talk', category: 'Public Speaking', date: '11-Feb-2026', points: 83 },
      { title: '[UNI] University workshop on test automation', category: 'University Partnership', date: '28-Oct-2025', points: 35 },
      { title: '[LAB] Curating Playwright workshop', category: 'Education', date: '14-Jul-2025', points: 48 },
      { title: '[REG] Internal training on shift-left testing', category: 'Public Speaking', date: '01-Apr-2025', points: 70 },
    ],
  },
  {
    id: 30,
    name: 'Palina Astapchuk',
    title: 'Software Engineer',
    unit: 'BG3.U1.G2.T2',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10030.jpg',
    activities: [
      { title: '[LAB] Mentoring of Vladislav Petrov', category: 'Education', date: '03-Apr-2026', points: 59 },
      { title: '[UNI] Academic internship supervision', category: 'University Partnership', date: '20-Jan-2026', points: 30 },
      { title: '[REG] TypeScript conference talk', category: 'Public Speaking', date: '12-Nov-2025', points: 87 },
      { title: '[LAB] Lecturing on design patterns', category: 'Education', date: '28-Jul-2025', points: 52 },
      { title: '[REG] Internal talk on monorepos', category: 'Public Speaking', date: '15-Apr-2025', points: 68 },
      { title: '[LAB] Curating Node.js lab', category: 'Education', date: '02-Feb-2025', points: 44 },
    ],
  },
  {
    id: 31,
    name: 'Elena Golovach',
    title: 'Software Engineer',
    unit: 'EQ.U1.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10031.jpg',
    activities: [
      { title: '[LAB] Mentoring spring 2026', category: 'Education', date: '10-Mar-2026', points: 40 },
      { title: '[REG] Talk at winter meetup', category: 'Public Speaking', date: '15-Jan-2026', points: 55 },
    ],
  },
  {
    id: 32,
    name: 'Brwa Bokur',
    title: 'QA Engineer',
    unit: 'BG3.U2.G1.T1',
    avatarUrl: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed10032.jpg',
    activities: [
      { title: '[UNI] Guest lecture autumn', category: 'University Partnership', date: '20-Oct-2025', points: 35 },
      { title: '[LAB] Curating testing lab', category: 'Education', date: '05-May-2025', points: 50 },
    ],
  },
]

export interface LeaderboardFilters {
  year: string
  quarter: string
  category: string
  search: string
}

export function getActivityYears(): string[] {
  const yearSet = new Set<number>()
  for (const user of users) {
    for (const activity of user.activities) {
      const year = parseInt(activity.date.split('-')[2]!, 10)
      yearSet.add(year)
    }
  }
  if (yearSet.size === 0) return []
  const min = Math.min(...yearSet)
  const max = Math.max(...yearSet)
  const years: string[] = []
  for (let y = max; y >= min; y--) {
    years.push(String(y))
  }
  return years
}

export function getUsers(filters?: LeaderboardFilters): User[] {
  let result = [...users]

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q) ||
        u.unit.toLowerCase().includes(q),
    )
  }

  if (filters?.year && filters.year !== 'All Years') {
    const y = parseInt(filters.year, 10)
    result = result.filter((u) =>
      u.activities.some((a) => parseActivityDate(a.date).year === y),
    )
  }

  if (filters?.quarter && filters.quarter !== 'All Quarters') {
    const q = parseInt(filters.quarter.replace('Q', ''), 10)
    result = result.filter((u) =>
      u.activities.some((a) => getQuarter(parseActivityDate(a.date).month) === q),
    )
  }

  if (filters?.category && filters.category !== 'All Categories') {
    result = result.filter((u) =>
      u.activities.some((a) => a.category === filters.category),
    )
  }

  result.sort((a, b) => totalScore(b) - totalScore(a))

  return result
}
