import React from 'react'

import ContactForm from "./ContactForm"

const Services = () => {
  return (
    <div className="center services-outer">
      <div className="row services-container">
        <div className="col-xs-12 col-sm-6 services-box">
          <div className="services-inner">
            <div className="services-title">Technology Advisor</div>
            <p>When creating data science microservices, products, and systems, you need a scalable robust infrastructure and deployment plan.  Picking the right platform to suit your use case is difficult.  We can help cut through the marketing BS and identify the solutions that will scale for you.</p>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 services-box">
          <div className="services-inner">
            <div className="services-title">Team Building</div>
            <p>Are you looking to hire your first data scientist or expand your fledgling team?  Finding the right data scientist to match your unique business needs can be challenging.  We can help you recruit a world class team.</p>
          </div>
        </div>
      </div>
      <div className="row services-container">
        <div className="col-xs-12 col-sm-6 services-box">
          <div className="services-inner">
            <div className="services-title">Solutions</div>
            <p>Looking to integrate data science into your company but not yet looking to build a full time team?  Let us help take you from proof of concept to production delivery.</p>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 services-box">
          <div className="services-inner">
            <div className="services-title">Advertising</div>
            <p>Data Skeptic is the #1 ranked data science related podcast on iTunes.  We reach a highly targeted audience on a weekly basis via the podcast as well as via the Data Skeptic blog and other outlets.  Let's talk about how we can help get your message to our audience.</p>
          </div>
        </div>
      </div>
      <div className="clear"></div>
      <ContactForm />
    </div>
  )
}

export default Services