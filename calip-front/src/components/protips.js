import React from "react";

class Protips extends React.Component {
  render() {
    return (
      <div className="about">
        <h3>Some tips on how to make the best use of platform</h3>
        <p>
          <ol>
            <li>Keep you cards small in size ( atmost 100 words )</li>
            <li>
              Learn markdown and use it to your advantage to create beautiful
              cards
            </li>
            <li>Always try to pack as much value as you can in the card</li>
            <li>
              Keep the first card an About card, a introduction to the course
              and what you believe the user can achieve by the end
            </li>
            <li>
              Keep all the promotion etc in the last card ( promotion of your
              youtube channel / blog )
            </li>
            <li>
              Avoid posting useless and non - educational content, your cards
              will be monitored and if useless content is posted, your account
              may be banned
            </li>
            <li>
              Avoid using copyright material, keep the explanations etc mostly
              In your words and guide the user to the actual source , so that
              they have option to explore in depth
            </li>
            <li>
              Don’t publish the card chain until it is complete, save It as a
              draft and edit it later ( also save your chain as draft at regular
              intervals , no autosave for now )
            </li>
          </ol>
        </p>
      </div>
    );
  }
}

export default Protips;
