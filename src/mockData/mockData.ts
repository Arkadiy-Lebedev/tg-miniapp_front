
interface IMockData {
    name: string,
    winStreak?: number,
    userId: number,
    currentEnergy: number,
    ticket: number,
}

export const MOCK_DATA:IMockData =     {
    name: "Аркадий",
    winStreak: 2,
    userId: 12321,
    currentEnergy: 333,
    ticket: 6,
  }

  export const MOCK_INITDATA = "query_id=AAHykfhOAAAAAPKR-E63XFwc&user=%7B%22id%22%3A1324913138%2C%22first_name%22%3A%22%D0%90%D1%80%D0%BA%D0%B0%D0%B4%D0%B8%D0%B9%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22arkadii23%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FOHJHKiBD4KHMn204_UPrdFOY3odvJboo6bcavwzhAxY.svg%22%7D&auth_date=1750526124&signature=0vrOfzHKNAZ5iRNUKlkEj8Hw1CYQaHbIavUkChpqlNfzOFO2X-T__02ML7ZWW7apWyfuIQ02ZtCwSblwHyinDg&hash=a2237f6078bd51f70cb2428c3c00411824e61f964708fd98b7a1e5f1f48ba989"