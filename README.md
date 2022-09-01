# Belly Button Diversity

## Overview
We have partnered with Improbable Beef to find alternate ways to get the flavor of beef.  Our lab is searching for bacteria that can synthesize such a protein, and to try to find it we've swabbed a few hundred belly buttons.  The test subjects are anonymous, but have unique IDs that are used to track their individual results.  Here, we have composed a dashboard to show responsive figures to represent the bacteria cultures found for each subject.

## The Dashboard
Our dashboard uses Bootstrap and D3 to create a dropdown menu listing each Subject ID.  When selected, the page populates with some demographic information about the subject, as well as three responsive figures.  The first plot is a bar chart displaying the 10 most populous bacteria strains.  When you hover over a bar, it lists the labels for the strain(s), while the bar chart itself is labeled with OTUs.  OTUs, or Operational Taxonomical Units, represent groups of similar species, so some bars have multiple labels.  The second image is a gauge showing how often a subject washes their belly button, ranging from 0 to 10 washes per week.  The third and final plot is a bubble chart, representing the amount of each strain of bacteria found in our sample. 
