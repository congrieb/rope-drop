# rope-drop

This is the repo for the backend built on Firebase. Repo for the Android app: https://github.com/congrieb/RopeDropAndroid 

Android App for planning the optimal ski day at Solitude and alerting on terrain openings.

Ski resort websites typically will tell you how much snow fell in the last 24 hours, past 7 days, etc... and they will tell you if each run is currently open or not, but thats not always enough information to let you what is going to be worth skiing that day. At a resort like Solitude, the best skiing is behind their avalanche controlled terrain gates, which they often mark as "Closed" on their website at the end of each day. Making it hard to know how much untracked powder is left for the current storm cycle.

When I am trying to decide if I want to go skiing tomorrow, the information I really want to know is:
 - What gates have already opened this storm cycle?
 - How long have they been open?
 - What gates are still closed?
 - How much snow has fallen since those gates have last opened?

For example, if its Thrusday night, and 3 feet of snow falls on Monday, Tuesday and Wednesday and I am trying to decide if I should take PTO to ski on Friday. I can check Rope Drop and see:
1.  Even though there won't be any fresh snow tonight, the Honeycomb gates haven't opened since Sunday and they have 3 feet of untouched snow on them, Evergreen was open on Tuesday but we've received 12 inches since it was last open on Tuesday. That would let me know that it would be an awesome day to ski, even if it doesn't seem like a "powder day" because its a few days after a storm.
   
   OR
   
2. There won't be any fresh snow tonight, and Honeycomb was open all day today, and Evergreen wasn't open today, but it was open on Tuesday and we only got 3 inches of snow since it was last open Tuesday. That would let me know that there isn't much poweder left to find for this storm, and I might wait to use my PTO another day.

![Screenshot_20240529-151230](https://github.com/congrieb/rope-drop/assets/6166729/5daa35cc-a453-4d8c-a64d-1624776ca205)

Trying to make this decision without Rope Drop requires asking around if anybody knows which gates were open today (because they are often marked as closed on the website at the end of the day) and then cross referencing that information with the snowfall report.

Once I've decided to take PTO and go ski on Friday, I want to make sure that I am able to get to the Honeycomb gate as soon as it opens, but I don't want to waste my time camping out at the gate waiting for patrol to open it. I also don't want to have to keep taking my hand out of my gloves and refreshing the resort's website to check if the gate has opened. To solve this problem, I can toggle on notifications for the Honeycomb gate, and Rope Drop will send a push notification to my phone and smart watch telling me "The Honeycomb gate just opened with 32 inches of fresh snow" so I can head that way right away. 


![PXL_20240409_032607949](https://github.com/congrieb/rope-drop/assets/6166729/fcc179fd-4b03-492a-9983-b6ee78dc6f55)
