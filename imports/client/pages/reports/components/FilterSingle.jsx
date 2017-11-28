import React from 'react';
import {Segment, Button} from 'semantic-ui-react'

export default class FiltersSingle extends React.Component {
    constructor() {
        super();
    }

    deleteFilter(name) {
        this.props.deleteFilter(name);
    }

    render() {
        const {name} = this.props;

        return (
            <Segment>

                {name && name.charAt(0).toUpperCase() + name.slice(1)}

                <Button onClick={this.deleteFilter.bind(this, name)}
                        floated='right'
                        color="red">
                    Delete
                </Button>
            </Segment>
        )
    }
}
