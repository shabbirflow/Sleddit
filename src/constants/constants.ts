export const stuff: iStuff = {
    title: 'Sleddit',
    signinLine: 'We missed you.',
    signinSubLine: "Use your google account to sign in.",
    googleToastTitle: "There was an error",
    googleToastDescription: "There was an error logging in with google",
    signupLine: 'Continue to set up a Sleddit account.',
    signupSubline: "It'll be great, trust me.",
    homeTagLine: "Your personal Sleddit Home Page. Come here to check in with your favourite communities.",
    createCommunityLine: "Community names with capitalization cannot be changed.",
    INF_SCROLLING_PAGINATION_AMOUNT: "3"
    
}

interface iStuff {
    [key: string]: string;
  }