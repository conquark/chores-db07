family member structure:
{
    _id:            "[person's first name]",
    name:           "[person's first name]",
    type:           "person",
    admin:          true or false (default to false, except for first user)    
}


    

chore structure:
{
    _id:            "[datetimestamp.toISOString]",
    name:           "[chore name]",
    type:           "chore",
    frequency:      "[****TODO - NEED TO FIGURE THIS OUT]",
    value:          "[a number]",
    description:    "[paragraph description of task]",
    category:       "[*****category - NEED TO PREDEFINE SOME]",
    assigned:       "first name of who chore is assigned to",
    assignedby:     "first name of who assigned the chore (if the person chose the chore him or herself, it will be their own first name)",
    complete:       true or false (default to false),
    completiondate: "[date]",
    needsapproval:  true or false (default to false),
    approved:       true or false (default to false),
    approvaldate:   "[date]" (same as completion date if a chosen chore),
    approvedby:     "[first name of whoever approved the chore]" (your name if you chose it),
    duedate:        "[optional due date for chore]"
}

goal structure:

{
    _id:            "[datetimestamp.toISOString]",
    name:           "[name chosen by child]",
    type:           "goal",
    cost:           "[a number]",
    allocated:      "[a number]",
    complete:       true or false (default to false),
    picture:        "[*****TODO - NEED TO MAKE PICTURE FUNCTIONALITY]",
    description:    "[paragraph text]",
    duedate:        "[optional date]"
}

badge structure:
{
    _id:            "[datetimestamp.toISOString]",
    name:           "[badge name]",
    type:           "badge"
    icon:        "[****SOME WILL BE PREDEFINED, LATER GIVE ADMINS BADGE-MAKING POWER]",
    description:    "[fun description of badge]"
}
    
sponsor structure:
{
    _id:            "[datetimestamp.toISOString]",
    name:           "[sponsor name]",
    type:           "sponsor",
    logo:           "[********NEED TO FIGURE OUT]",
    mainlink:       "[link]",
    secondarylink:  "[link]"
}