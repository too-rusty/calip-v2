import React from "react";
import "./about.css";

class About extends React.Component {
  render() {
    return (
      <div style={{ padding: 50 }}>
        <div>
          <h2>What is calip ?</h2>
          <p>
            Calip is an idea sharing platform. Users can share ideas, 
            create courses in the form of small innovative byte sized custom cards.
            Creators can make courses as a card chain consisting of high value informative cards
            mixing their own insights while aggregating the best content from all over the internet.
            Learners can find card chains relevant to them and learn complex stuff in a matter of minutes.
            In simple terms we are making a definitive gateway to the dispersed sea of information out there, 
            the internet, powered by the users of the platform.
          </p>
        </div>

        <div>
          <h2>Calip for learners</h2>
          <p>
            In a world where attention span is limited and social media is booming,
            calip has been designed with the idea that people can learn a topic in a 
            relatively short amount of time with some level of mastery in that topic.
            Calip is a content creation and Content discovery platform .
            We are working on a personalised local search engine to provide the best recommendations
            about the courses created on calip.
          </p>
        </div>

        <div>
          <h2>What is a card chain ?</h2>
          <p>
            Well think youtube playlist but hackable. Card chains are simply
            collection of cards in some order. Cards are collection of your
            ideas, website links , embedded youtube/twitch videos ( video cards
            ) and most importantly your personal view on the topic in an order
            so that the readers can get the best value out of it.
          </p>
        </div>

        <div>
          <h2>Why would you Create courses on calip ?</h2>
          <p>
            <ol>
              <li>
                You can create courses in a unique way, creation via aggregation
              </li>
              <li>
                You can directly write down your insights on the topic and
                provide credible sources ( websites , youtube videos etc. )
              </li>
              <li>
                Create upskilling courses which can be easily found by everyone
                ( we are working on a complex local search and recommendation
                engine )
              </li>
              <li>
                Be creative , mix and match , there is no limit to the various
                ways you can create a card chain
              </li>
              <li>
                You can also create courses and at the same time promote your
                blog, youtube channel ( by embedding educational videos from
                your youtube channel )
              </li>
              <li>
                Create the best possible learning path for the audiences and
                build a following ( upcoming feature )
              </li>
              <li>
                Help the community get the best value by creating/aggregating
                useful and important content from all over the web and become a
                part of something big
              </li>
              <li>
                Form courses / content on one of the special categories topic to
                make it more discoverable ( or you can use your own tags and we
                will make it discoverable by adding it to the categories)
              </li>
            </ol>
          </p>
        </div>

        <div>
          <h2>Why not youtube, Why calip ?</h2>
          <p>
            Well youtube is a very nice platform where you can upload your
            videos , infact we recommend it You can then embed those videos in
            small byte sized cards on calip along with explanations , your
            insights on them and other useful resources from the internet This
            way you promote your video/ channel and at the same time convey your
            message directly to the viewers Although we will be adding the
            feature to upload your own video but this method will be much more
            easier ( you get to be famous on YouTube and at the same time build
            your following here ) Also there’s too much competition on youtube ,
            we will be marketing and ensuring that your courses are visible to
            the right kind of users visiting calip
          </p>
        </div>

        <div>
          <h2>Our Goals</h2>
          <p>
            Make a platform which is a paradise for content creators , who can
            create useful courses for the masses in an easy manner. Make a
            platform where learners can upskill themselves with the help of AI
            powered Search and recommendation engine
          </p>
        </div>

        <div>
          <h2>Contact and feedback</h2>
          <p>
            I can be reached out at abhish014@gmail.com , any feedback is welcome :)
          </p>
        </div>
      </div>
    );
  }
}

export default About;
