import { Story, Meta } from '@storybook/react';
import { Name, NameProps } from "./Name";

export default {
    title: "Name",
    component: Name
} as Meta;

const Template: Story<NameProps> = (args) => <Name {...args} />;

export const Hello = Template.bind({});

Hello.args = {
    name: "Sam"
}
