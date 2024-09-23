export interface SocialEntry {
  type: 'github' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: 'cmy',
    avatar: '',
    username: 'Cyanix-0721',
    title: 'Mortal',
    desc: '专注后端开发，热爱编程，喜欢折腾，寻求工作机会，欢迎联系cmy4444.jmu@vip.163.com',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/Cyanix-0721' },
    ],
    emailAliases: ['cmy4444.jmu@vip.163.com'],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
